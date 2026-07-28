// ============================================================================
// certificateIcons.js
// ----------------------------------------------------------------------------
// Raw SVG path data (viewBox 0 0 24 24) for the icons used only on this page.
//
// The project already has a shared <Icon name="..." /> component
// (src/components/candidatepage/shared/Icon). Icons like "search" and "bell"
// already resolve through it. The icons below (ribbon/certificate, trending
// up, share, check, download) are NOT part of that icon set, so they are
// defined here as plain path data you can use in two ways:
//
//   1) Quick local use (what this page does): render them directly as
//      <svg><path d={ICON_PATHS.certificate} /></svg> — see CertificateStats
//      and CertifiedBadge for examples.
//
//   2) Recommended long-term: copy these entries into the shared Icon
//      component's internal icon map (wherever it keeps "search"/"bell"/etc.)
//      so you can just do <Icon name="certificate" /> everywhere, the same
//      way the rest of the app already works.
//
// All paths are Material Design style, 24x24 viewBox, single <path fill="currentColor">.
// ============================================================================

export const ICON_PATHS = {
  // Certificate / ribbon badge — used on the "Certificate earned" stat card
  // and reused (larger) inside CertifiedBadge.
  certificate:
    "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 13.5L7 11l1.41-1.41L10.5 11.67l5.09-5.09L17 8l-6.5 6.5z",

  // Hourglass — used on the "In progress" stat card.
  hourglass:
    "M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zM12 11.5l-4-4V4h8v3.5l-4 4z",

  // Trending up arrow — used on the "Average Grade" stat card.
  trendingUp: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",

  // Share / nodes icon — used on the "Shared to Profile" stat card and the
  // small share button on each certificate card.
  share:
    "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L7.04 9.81C6.5 9.31 5.79 9 5 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",

  // Download arrow — optional, available if you want an icon inside the
  // "Download" button.
  download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
};
