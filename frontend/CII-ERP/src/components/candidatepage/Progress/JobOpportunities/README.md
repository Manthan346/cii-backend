# Progress > Job Opportunities

Location in the project:

```
src/components/candidatepage/
├── layout/
│   ├── Sidebar/
│   └── Topbar/
├── shared/
│   ├── Icon/
│   ├── StatCard/
│   └── StatusBadge/
├── data/
│   ├── assessmentsData.js
│   └── jobOpportunitiesData.js               <-- NEW (stats + job listings)
├── Attendance/
├── Dashboard/
├── MyCourses/
├── Profile/
└── Progress/
    ├── Assessments/
    ├── Certificates/
    └── JobOpportunities/                     <-- this folder
        ├── JobOpportunities.jsx / .css       (page shell: Sidebar + Topbar + content)
        ├── jobOpportunitiesIcons.js          (raw SVG path data, UI-only — see note below)
        ├── index.js                          (barrel export)
        │
        ├── JobStats/
        │   ├── JobStats.jsx                  (solid-blue stat card row)
        │   └── JobStats.css
        │
        ├── JobFiltersBar/
        │   ├── JobFiltersBar.jsx             ("Filters | Location | Type | Roles | Sort by")
        │   └── JobFiltersBar.css
        │
        ├── JobList/
        │   ├── JobList.jsx                   (horizontally-scrolling row of JobCard)
        │   └── JobList.css
        │
        ├── JobCard/
        │   ├── JobCard.jsx                   (single job card)
        │   └── JobCard.css
        │
        └── HiringBanner/
            ├── HiringBanner.jsx              ("WE'RE HIRING" illustration, inline SVG)
            └── HiringBanner.css
```

## Why the data file lives in `data/`, not inside this folder

Per your project's convention (`assessmentsData.js` already lives in
`candidatepage/data/`), `jobOpportunitiesData.js` is placed there too,
**not** inside `Progress/JobOpportunities/`. It exports:

- `jobOpportunityStats` — the 2 stat cards
- `jobFilterOptions` — filter pill config
- `jobOpportunities` — the job cards

`jobOpportunitiesIcons.js`, by contrast, **stays inside this component
folder**. It's static SVG glyph data (icon shapes), not page content — it
will never come from your API or vary per candidate, so it doesn't belong
alongside the data files that do. See the comment at the top of that file
for the same reasoning.

## Import depth cheat-sheet

- `JobOpportunities.jsx` (directly inside `JobOpportunities/`) reaches:
  - `layout/` and `shared/` via **`../../`**
  - `data/` via **`../../data/jobOpportunitiesData`**
  (both go up through `Progress/` to `candidatepage/`).
- Sub-components (inside their own folder, e.g. `JobCard/`) reach:
  - `shared/` via **`../../../`**
  - `data/` via **`../../../data/jobOpportunitiesData`**
  - `jobOpportunitiesIcons.js` via **`../jobOpportunitiesIcons`** (it lives
    one level up, at the `JobOpportunities/` root)
- Sub-components reach each other with **`../OtherComponent/OtherComponent`**
  (e.g. `JobList.jsx` imports `../JobCard/JobCard`, which imports
  `../HiringBanner/HiringBanner`).

## Sidebar overlap fix

`Sidebar.css` positions the sidebar with `position: fixed; width: 240px`,
which removes it from normal document flow — a flex/grid wrapper around it
won't reserve space for it. `JobOpportunities.css` instead gives the main
content column `margin-left: 240px` (collapsing to `0` at the same `900px`
breakpoint where `Sidebar.css` turns the sidebar into an off-canvas drawer).
The same fix was applied to `Assessments.css` and `Certificates.css`.

## One thing to fix in `Sidebar.jsx`

`NAV_PROGRESS` currently has:
```js
{ icon: 'jobs', label: 'Job Opportunities', to: null }
```
Because `to` is `null`, `NavItem` renders a plain `<button>` instead of a
`<Link>` (see `Sidebar.jsx`: `if (to) return <Link ... />`), so clicking
"Job Opportunities" in the sidebar currently does nothing. Update it to:
```js
{ icon: 'jobs', label: 'Job Opportunities', to: '/progress/job-opportunities' }
```

## Icons used

`jobOpportunitiesIcons.js` contains raw SVG `path` data for: `lightbulb`,
`send`, `filter`, `chevronDown`, `sort`, `bookmarkOutline`/`bookmarkFilled`.
The `HiringBanner` illustration (spotlight + chair + "WE'RE HIRING" text) is
a fully self-contained SVG built directly in `HiringBanner.jsx` — no image
asset needed.

## Shared / layout components used

- **`Sidebar`** — `isOpen`, `onClose`, `activeItem="Job Opportunities"`
  (must match the nav label exactly).
- **`Topbar`** — `onMenuClick`, `search`, `onSearch`, `userInitials`.

## Routing

```jsx
import JobOpportunities from "src/components/candidatepage/Progress/JobOpportunities";

<Route path="/progress/job-opportunities" element={<JobOpportunities />} />
```

## Backend integration

See the comment block at the top of `data/jobOpportunitiesData.js` for the
full list of suggested endpoints (stats, listing with filters, apply, save).
Handlers in `JobOpportunities.jsx` (`handleApply`, `handleToggleSave`,
`handleOpenFilters`, `handleOpenDropdown`) already log to the console with
`// BACKEND NOTE` comments showing exactly what to swap in.
