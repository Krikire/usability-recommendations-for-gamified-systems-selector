export function deduplicate<T extends Record<string, any>>(rows: T[]): T[] {
  const map = new Map<number, Record<string, any>>();

  const splitVals = (v: any) => String(v).split(/,\s*/).filter(Boolean);

  rows.forEach((row) => {
    const idx = row.ruleIdx as number;
    if (!map.has(idx)) {
      map.set(idx, { ...row });
      return;
    }

    const agg = map.get(idx)!;
    Object.keys(row).forEach((field) => {
      if (field === "id" || field === "ruleIdx") return;

      const val = row[field];
      if (val == null || val === "" || val === "-") return;

      const existing = agg[field];
      if (existing == null || existing === "" || existing === "-") {
        agg[field] = val;
      } else if (existing !== val) {
        const mergedSet = new Set<string>([
          ...splitVals(existing),
          ...splitVals(val),
        ]);
        agg[field] = Array.from(mergedSet).join(", ");
      }
    });
  });

  return Array.from(map.values()) as T[];
}
