# Gamification Recommendations Selector

A web tool that helps designers and researchers choose which **gamification
elements** (badges, leaderboards, points, virtual currency, avatars, …) to
put into a system, and how to make them **usable and accessible** for the
target audience.

The user describes their audience and goals — age group, application domain,
disorder / accessibility needs, gamification goal, usability goal, usability
principle — and the tool returns:

1. **General usability recommendations** for the whole system
2. A three-way split of gamification elements: **recommended**, **not
   recommended**, and **other**
3. **Element-specific usability recommendations** for the elements the user picks
4. **WCAG 2.2 and ISO** accessibility recommendations for those elements,
   tailored to the specified disorder

---

## Origins

The knowledge base was originally authored as **DMN decision tables**
(a BPMN-related XML standard) inside Camunda. It went through two
implementations:

1. **Original** — Spring Boot 3 / Java 21 backend running the DMN engine
   directly, with a React 18 + Material UI frontend. Still present on the
   deployment server under `backend/` and `frontend/`.
2. **Current** — the DMN tables were translated to Postgres rows (via the
   Python scripts in [py/](py/)), and the app was rewritten as a single
   Next.js 15 project in [new_frontend/](new_frontend/) with Prisma as the
   data access layer.

The `new_frontend/` app is what runs in production today.

---

## Repository layout

```
gamification/
├── new_frontend/       # Next.js 15 + React 19 + Prisma app (production)
│   ├── app/            # App Router pages + API routes
│   │   ├── api/        # 4 rule pipelines + saved-result CRUD
│   │   └── lib/        # criteria sanitisation, WHERE-builder, dedup
│   ├── components/     # React UI components
│   ├── prisma/         # schema.prisma + migrations
│   ├── .next/          # built output (checked in for reference)
│   ├── RULES_LOGIC.md      # formal rules spec (English)
│   ├── RULES_LOGIC.lt.md   # formal rules spec (Lithuanian)
│   └── RULES_LOGIC.html    # visual rules explainer (Lithuanian)
│
└── py/                 # DMN → SQL translation pipeline
    ├── *.dmn                       # source DMN files (three revisions)
    ├── dmntosql.py                 # DMN → SQL converter
    ├── dmnreplace.py               # DMN text-replacement helper
    ├── translate_recommendations.py # main translation entry point
    └── find.py                     # lookup helper
```

---

## The four rule pipelines

Every recommendation the app produces comes out of one of four backend
endpoints. Each is a straightforward `if (criteria) then {result}` rule
implemented as a Prisma query.

| Pipeline | Endpoint | What it returns |
|---|---|---|
| **A** | `POST /api/generalised-recommendations` | General usability recommendations for the whole system |
| **B** | `POST /api/gamification-elements` | Gamification elements split into *recommended / not recommended / other* |
| **C** | `POST /api/elements-usability` | Usability recommendations for the elements the user picked |
| **D** | `POST /api/recommendations` | WCAG 2.2 + ISO accessibility recommendations per picked element |

The full formal specification lives in [new_frontend/RULES_LOGIC.md](new_frontend/RULES_LOGIC.md).
A visual, Lithuanian-language explainer is at [new_frontend/RULES_LOGIC.html](new_frontend/RULES_LOGIC.html).

### Universal rule shape

```
if (criterion₁ ∧ criterion₂ ∧ … ∧ criterionₙ)
then {result set}
```

- `∧` = `AND` (all criteria must hold)
- A criterion the user did not select (or marked `"Not applicable"`) is
  treated as *"no constraint"* and passes automatically
- Pipelines A and B have a **fallback** rule: if the strict rule returns
  nothing, the query relaxes to `(ageGroup ∧ applicationDomain)` only

The only `NOT` in the system is in Pipeline B — the *other* group is defined
as the elements that are neither *recommended* nor *not recommended*.

---

## The criteria

| Symbol | Field | Meaning |
|---|---|---|
| AG | `ageGroup` | Target age group of end users |
| AD | `applicationDomain` | Domain the system is being built for (education, health, …) |
| DI | `disorder` | Disability or disorder to accommodate |
| UG | `usabilityGoal` | Desired usability outcome |
| GG | `gamificationGoal` | Purpose the gamification should serve |
| UP | `usabilityPrinciple` | Underlying usability principle (Pipeline A only) |
| GE | `gamificationElement` | Elements the user has picked (Pipelines C, D) |

Each criterion is a multi-select set of strings. `"Not applicable"` is a
sentinel that means "ignore this dimension" and gets normalised to the empty
set before the rule fires.

---

## Data model

Postgres, managed via Prisma ([new_frontend/prisma/schema.prisma](new_frontend/prisma/schema.prisma)).

Rule tables (populated from DMN):
- `generalised_recommendations`
- `suitable_gamification_elements`
- `not_suitable_gamification_elements`
- `usability_recommendations_for_gamification_elements_wcag_2_2_`
- `usability_recommendations_for_gamification_elements_iso_`
- `usability_characteristics`

Persistence tables (user output):
- `SavedResult` — a named "run" the user saved
- `Saved*` — per-row selection status and annotations

Each recommendation row can be tagged with a `RecommendationStatus`:
`FIT`, `PARTIAL_FIT`, `NON_FIT`, or `null`. This annotation is stored
alongside the saved result and does **not** affect which rows the pipelines
return.

---

## Running locally

### Prerequisites
- Node.js 20+
- A Postgres database
- The SQL dump from `FILES_FOR_CLAUDE/20260517.sql` on the deployment
  server (or a fresh dump), imported into the local Postgres

### Setup

```bash
cd new_frontend
npm install
cp .env.example .env    # then edit DATABASE_URL
npx prisma generate
npx prisma migrate deploy
npm run dev             # → http://localhost:3000
```

### Production build

```bash
npm run build
npm start               # defaults to port 3000
```

---

## Deployment

Production runs on a Hetzner VPS as `gamif-next.service` (systemd) behind
nginx as a reverse proxy. The service runs `next start -p 3000 -H 127.0.0.1`
as user `gamif` from `/home/gamif/app/new_frontend/`.

---

## Regenerating the rule database from DMN

If the DMN source changes, the Postgres tables can be regenerated with:

```bash
cd py
python translate_recommendations.py   # translates ISO/WCAG references
python dmntosql.py                    # emits INSERT statements
```

The output SQL then replaces the seed data in the target database.

---

## License

Not currently licensed — private academic project.
