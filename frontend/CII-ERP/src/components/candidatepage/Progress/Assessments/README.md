# Progress > Assessments

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
├── Attendance/
├── Dashboard/
├── MyCourses/
├── Profile/
└── Progress/
    └── Assessments/                          <-- this folder
        ├── Assessments.jsx / .css            (page shell: Sidebar + Topbar + content)
        ├── assessmentsData.js                (mock data + API notes)
        ├── index.js                          (barrel export)
        │
        ├── AssessmentsStats/
        │   ├── AssessmentsStats.jsx
        │   └── AssessmentsStats.css
        │
        ├── PendingAssessments/
        │   ├── PendingAssessments.jsx
        │   └── PendingAssessments.css
        │
        ├── PendingAssessmentItem/
        │   ├── PendingAssessmentItem.jsx
        │   └── PendingAssessmentItem.css
        │
        ├── CompletedAssessments/
        │   ├── CompletedAssessments.jsx
        │   └── CompletedAssessments.css
        │
        ├── CompletedAssessmentItem/
        │   ├── CompletedAssessmentItem.jsx
        │   └── CompletedAssessmentItem.css
        │
        ├── PerformanceByCourse/
        │   ├── PerformanceByCourse.jsx
        │   └── PerformanceByCourse.css
        │
        └── TipsCard/
            ├── TipsCard.jsx
            └── TipsCard.css
```

Each component now lives in its own folder with a matching `.jsx` + `.css`
pair, the same pattern used in `shared/` (e.g. `shared/StatCard/StatCard.jsx`).

## Import depth cheat-sheet

- `Assessments.jsx` (directly inside `Assessments/`) reaches `layout/` and
  `shared/` with **`../../`** (up through `Progress/` to `candidatepage/`).
- Every sub-component (inside its own folder, e.g. `PendingAssessmentItem/`)
  reaches `shared/` with **`../../../`** (up through its own folder, then
  `Assessments/`, then `Progress/`, to `candidatepage/`).
- Sub-components reach `assessmentsData.js` with **`../assessmentsData`**
  (it lives one level up, at the `Assessments/` root).
- Sub-components reach each other with **`../OtherComponent/OtherComponent`**
  (e.g. `PendingAssessments.jsx` imports
  `../PendingAssessmentItem/PendingAssessmentItem`).

If you move this folder to a different depth, update these relative paths
accordingly.

## Routing

Wherever Dashboard/Attendance/Profile/MyCourses are currently routed
(e.g. `react-router`), add a sibling route:

```jsx
import Assessments from "src/components/candidatepage/Progress/Assessments";

<Route path="/progress/assessments" element={<Assessments />} />
```

And point the "Assessments" sidebar link at that path.

## Shared / layout components used

This page assumes the following prop shapes for the shared components. If
your actual implementations differ, only the prop names need to change —
the data structures in `assessmentsData.js` can stay the same.

- **`Sidebar`** (`layout/Sidebar`) — `activeItem` prop to highlight
  "Assessments" under the Progress section.
- **`Topbar`** (`layout/Topbar`) — `searchPlaceholder`, `searchValue`,
  `onSearchChange` props for the search bar; renders the notification bell
  and avatar internally.
- **`Icon`** (`shared/Icon`) — `name` (string key, e.g. `"clipboard-list"`,
  `"clock"`, `"check-circle"`) and `size` (number, px).
- **`StatCard`** (`shared/StatCard`) — `icon`, `iconBg`, `iconColor`,
  `value`, `label`.
- **`StatusBadge`** (`shared/StatusBadge`) — `label`, `variant`
  (e.g. `"warning"` for the "Due in 2 days" pill).

## Backend integration

Every component/file has an inline comment block describing which REST
endpoint(s) it expects and how to wire up `useEffect`/`useState` (or your
data-fetching library of choice, e.g. React Query) once the backend is
ready. See `assessmentsData.js` for the full list of suggested endpoints.
