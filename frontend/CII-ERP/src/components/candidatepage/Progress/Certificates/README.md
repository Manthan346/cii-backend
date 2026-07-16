# Progress > Certificates

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
    ├── Assessments/
    └── Certificates/                         <-- this folder
        ├── Certificates.jsx / .css           (page shell: Sidebar + Topbar + content)
        ├── certificatesData.js               (mock data + API notes, per tab)
        ├── certificateIcons.js               (raw SVG path data used on this page)
        ├── index.js                          (barrel export)
        │
        ├── CertificateStats/
        │   ├── CertificateStats.jsx          (solid-blue stat card row)
        │   └── CertificateStats.css
        │
        ├── CertificateTabs/
        │   ├── CertificateTabs.jsx           ("Courses" / "Workshops" pill switch)
        │   └── CertificateTabs.css
        │
        ├── CertificateGrid/
        │   ├── CertificateGrid.jsx           (maps certificates -> CertificateCard)
        │   └── CertificateGrid.css
        │
        ├── CertificateCard/
        │   ├── CertificateCard.jsx           (single certificate card)
        │   └── CertificateCard.css
        │
        └── CertifiedBadge/
            ├── CertifiedBadge.jsx            (seal icon + "CERTIFIED" caption)
            └── CertifiedBadge.css
```

## How the Courses / Workshops toggle works

`Certificates.jsx` holds `activeTab` state (`'courses' | 'workshops'`).
`CertificateTabs` calls `onChange(tabKey)` when a pill is clicked, which
updates `activeTab`. That state is used to pick the right slice of data out
of `certificateStatsByTab` and `certificatesByTab` (in `certificatesData.js`),
which are passed down into `CertificateStats` and `CertificateGrid`. Swap
those local lookups for real fetches keyed by `activeTab` once your API is
ready — see the comment block at the top of `certificatesData.js` and
`Certificates.jsx`.

## Import depth cheat-sheet

- `Certificates.jsx` (directly inside `Certificates/`) reaches `layout/` and
  `shared/` with **`../../`** (up through `Progress/` to `candidatepage/`).
- Every sub-component (inside its own folder, e.g. `CertificateCard/`)
  reaches `shared/` with **`../../../`**, and reaches
  `certificatesData.js` / `certificateIcons.js` with **`../`** (both live at
  the `Certificates/` root).
- Sub-components reach each other with **`../OtherComponent/OtherComponent`**
  (e.g. `CertificateGrid.jsx` imports `../CertificateCard/CertificateCard`,
  which imports `../CertifiedBadge/CertifiedBadge`).

## Icons used

`certificateIcons.js` contains the raw SVG `path` data (24x24 viewBox) for:
`certificate` (ribbon/shield), `hourglass`, `trendingUp`, `share`, `download`.
These are rendered as inline `<svg>` in `CertificateStats`, `CertificateCard`,
and `CertifiedBadge`. They are **not** yet part of the shared `Icon`
component's name lookup — copy them in there if you'd like to use
`<Icon name="certificate" />` etc. app-wide instead.

## Shared / layout components used

- **`Sidebar`** (`layout/Sidebar`) — `isOpen`, `onClose`, `activeItem` props.
  `activeItem` is compared against each nav item's `label`
  (`active={activeItem === item.label}`), so pass the exact label text:
  `activeItem="Certificates"`.
- **`Topbar`** (`layout/Topbar`) — based on the visible usage in your
  Topbar.jsx (`onMenuClick`, `search`/`onSearch`, `userInitials`), those are
  the props wired up here. Double check against your actual function
  signature and adjust if it differs.

## Routing

```jsx
import Certificates from "src/components/candidatepage/Progress/Certificates";

<Route path="/progress/certificates" element={<Certificates />} />
```

## Backend integration

Every file has an inline comment block describing the REST endpoint(s) it
expects. See `certificatesData.js` for the full list of suggested endpoints
(stats, list, download, share).
