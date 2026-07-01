#!/usr/bin/env python3
"""DMN → PostgreSQL importer (May 2025)

Parses every <decisionTable> inside a DMN file, explodes "array"
FEEL expressions into cartesian‑product rows, and loads the result
into matching Postgres tables.

Usage
-----
python dmntosql.py <model.dmn> <postgres-dsn> [--keep-schema]

* By **default**, each run **drops and recreates** the tables, so the
  DB always reflects the DMN exactly.
* Pass **--keep-schema** to preserve existing rows and just `ALTER
  TABLE ADD COLUMN` for any newcomers.

Example
-------
python dmntosql.py usabilityRecommendations.dmn \
    postgresql://postgres:secret@localhost:5432/gamification
"""
from __future__ import annotations

import itertools
import logging
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, Dict, Iterable, List

import psycopg2
import psycopg2.extras as ext
from psycopg2.sql import SQL, Identifier

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("dmn2pg")

# ---------------------------------------------------------------------------
# Regex helpers
# ---------------------------------------------------------------------------
EMPTY_RE = re.compile(r"^\s*$")
QUOTE_RE = re.compile(r'"([^\"]+)"')  # "education" → education
ARRAY_RE = re.compile(r"\[\s*([^\]]+?)\s*\]")  # ["adult","elderly"]
ITEM_SPLIT = re.compile(r"\s*,\s*")


# ---------------------------------------------------------------------------
# XML / FEEL cleaning helpers
# ---------------------------------------------------------------------------

def get_nsmap(root: ET.Element) -> Dict[str, str]:
    """Return a namespace mapping that matches the file's DMN URI."""
    m = re.match(r"\{(.+)}", root.tag)
    return {"dmn": m.group(1) if m else ""}


def clean_cell(raw: str | None) -> str | List[str]:
    """Turn raw <text> content into Python value(s).

    • <text/> or <text></text> → ""  (empty string)
    • '"foo" in bar'          → "foo"
    • array expression         → [list, of, items]
    • otherwise                → stripped string
    """
    if raw is None or EMPTY_RE.fullmatch(raw):
        return ""
    raw = raw.strip()

    # Array?  some x in y satisfies x in ["a","b"]
    if (m := ARRAY_RE.search(raw)):
        items = ITEM_SPLIT.split(m.group(1))
        return [i.strip().strip('"') for i in items]

    # Quoted scalar?  "education" in domain
    if (m := QUOTE_RE.search(raw)):
        return m.group(1)

    return raw


def explode_row(values: List[str | List[str]]) -> Iterable[List[str]]:
    """Yield cartesian‑product rows when any value is a list."""
    pools = [v if isinstance(v, list) else [v] for v in values]
    for combo in itertools.product(*pools):
        yield list(combo)


# ---------------------------------------------------------------------------
# DMN parser → dicts
# ---------------------------------------------------------------------------

def extract_tables(tree: ET.ElementTree) -> Iterable[Dict[str, Any]]:
    """Yield one dict per decision table with rows already exploded."""
    root = tree.getroot()
    ns = get_nsmap(root)

    for dec in root.findall(".//dmn:decision", ns):
        d_name = dec.attrib.get("name") or dec.attrib["id"]
        dt = dec.find("dmn:decisionTable", ns)
        if dt is None:
            continue

        # Input & output headers
        inputs = [
            (inp.attrib.get("label")
             or inp.find("dmn:inputExpression/dmn:text", ns).text.strip())
            for inp in dt.findall("dmn:input", ns)
        ]
        outputs = [
            (out.attrib.get("name") or f"output_{i}")
            for i, out in enumerate(dt.findall("dmn:output", ns), 1)
        ]

        rows: List[Dict[str, Any]] = []
        for rule_idx, rule in enumerate(dt.findall("dmn:rule", ns), 1):
            in_cells = [
                clean_cell(c.text if c is not None else "")
                for c in rule.findall("dmn:inputEntry/dmn:text", ns)
            ]
            out_cells = [
                clean_cell(c.text if c is not None else "")
                for c in rule.findall("dmn:outputEntry/dmn:text", ns)
            ]

            for combo in explode_row(in_cells):
                row = {**dict(zip(inputs, combo)), **dict(zip(outputs, out_cells))}
                row["rule_idx"] = rule_idx
                rows.append(row)

        log.info(
            "🔍 Found decision table '%s' with %d inputs and %d outputs. → %d rows",
            d_name,
            len(inputs),
            len(outputs),
            len(rows),
        )
        yield {
            "name": d_name,
            "table": re.sub(r"\W+", "_", d_name.lower()),
            "inputs": inputs,
            "outputs": outputs,
            "rows": rows,
        }


# ---------------------------------------------------------------------------
# Postgres DDL + DML helpers
# ---------------------------------------------------------------------------

def ensure_table(
    cur: "psycopg2.extensions.cursor",
    table: str,
    in_cols: List[str],
    out_cols: List[str],
    keep_schema: bool = False,
):
    """Create or evolve the table so it has all required columns."""

    if not keep_schema:
        cur.execute(SQL("DROP TABLE IF EXISTS {} CASCADE").format(Identifier(table)))

    # base table with rule_idx if it didn't exist
    cur.execute(
        SQL("CREATE TABLE IF NOT EXISTS {} (rule_idx int);").format(Identifier(table))
    )

    # existing columns
    cur.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = %s
        """,
        (table,),
    )
    existing = {r[0] for r in cur.fetchall()}

    # add newcomers
    for col in in_cols + out_cols:
        if col.lower() not in existing:
            cur.execute(
                SQL("ALTER TABLE {} ADD COLUMN {} text;").format(
                    Identifier(table), Identifier(col)
                )
            )
            log.info("➕ Added column %s to %s", col, table)



def bulk_insert(cur: "psycopg2.extensions.cursor", table: str, rows: List[Dict[str, Any]]):
    """Copy rows into Postgres with execute_values."""
    if not rows:
        return

    cols = list(rows[0].keys())
    values = [tuple(r[c] for c in cols) for r in rows]

    ext.execute_values(
        cur,
        SQL("INSERT INTO {} ({}) VALUES %s").format(
            Identifier(table), SQL(", ").join(map(Identifier, cols))
        ),
        values,
        page_size=1000,
    )
    log.info("✅ Inserted %d rows into %s", len(rows), table)


# ---------------------------------------------------------------------------
# Main driver
# ---------------------------------------------------------------------------

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    dmn_path = Path(sys.argv[1])
    dsn = sys.argv[2]
    keep_schema = "--keep-schema" in sys.argv[3:]

    tree = ET.parse(dmn_path)

    with psycopg2.connect(dsn) as conn, conn.cursor() as cur:
        for tbl in extract_tables(tree):
            #log.info("🔄 Creating table %s with columns: rule_idx + %s", tbl["table"], ", ".join(tbl["inputs"] + tbl["outputs"]))
            #ensure_table(cur, tbl["table"], tbl["inputs"], tbl["outputs"], keep_schema)
            bulk_insert(cur, tbl["table"], tbl["rows"])
        conn.commit()
        log.info("🎉 All decision tables ingested.")


if __name__ == "__main__":
    main()
