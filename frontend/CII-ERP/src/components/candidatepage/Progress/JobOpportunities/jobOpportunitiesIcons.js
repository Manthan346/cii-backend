// ============================================================================
// jobOpportunitiesIcons.js
// ----------------------------------------------------------------------------
// Raw SVG path data (viewBox 0 0 24 24) for icons used only on this page.
//
// NOTE: this is intentionally kept separate from jobOpportunitiesData.js
// (in ../../data/). That file holds page *content* (stats, job listings —
// the stuff that comes from your backend). This file holds static UI
// asset data (icon glyphs) that has nothing to do with the API — it won't
// change per-candidate or per-request, so it doesn't belong in the data
// folder.
//
// These are NOT yet part of the shared <Icon /> component's name lookup
// (src/components/candidatepage/shared/Icon). Copy them in there if you'd
// like to use <Icon name="lightbulb" /> etc. app-wide instead of the local
// inline <svg> usage in this page's components.
// ============================================================================

export const ICON_PATHS = {
  // "open opportunities" stat card icon.
  lightbulb:
    "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",

  // "Application sent" stat card icon.
  send: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",

  // "Filters" pill icon.
  filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",

  // Dropdown caret used in Location / Type / Roles pills.
  chevronDown: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z",

  // Up/down carets used in the "Sort by" pill.
  sort: "M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z",

  // Bookmark / save button on each job card (outline = not saved).
  bookmarkOutline:
    "M17 3H7c-1.1 0-2 .89-2 2v16l7-3 7 3V5c0-1.11-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z",
  // Filled variant, swapped in once a job is saved.
  bookmarkFilled: "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z",
};
