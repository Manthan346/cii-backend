// icons.jsx
// Minimal inline SVG icons so this feature has zero extra dependencies.
// Swap for lucide-react or your existing icon set if you prefer.

export const PinIcon = (props) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" {...props}>
    <path
      d="M10 2c-3 0-5.5 2.3-5.5 5.7 0 4 5.5 9.6 5.5 9.6s5.5-5.6 5.5-9.6C15.5 4.3 13 2 10 2Z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <circle cx="10" cy="7.7" r="2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const BriefcaseIcon = (props) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" {...props}>
    <rect
      x="2.5"
      y="6.2"
      width="15"
      height="10"
      rx="1.6"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M7 6.2V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.2"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M2.5 11h15" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const RupeeIcon = (props) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" {...props}>
    <path
      d="M5.5 4h9M5.5 7.3h9M8 4v0c3.6 0 5.5 1.4 5.5 3.3S11.6 10.6 8 10.6H5.5L12 16.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarIcon = (props) => (
  <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" {...props}>
    <path d="M10 1.6l2.5 5.3 5.7.6-4.3 3.9 1.2 5.7L10 14.4l-5.1 2.7 1.2-5.7-4.3-3.9 5.7-.6L10 1.6Z" />
  </svg>
);

export const ChevronLeftIcon = (props) => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" {...props}>
    <path
      d="M12.5 4.5 7 10l5.5 5.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" {...props}>
    <path
      d="M4.5 7.5 10 13l5.5-5.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon = (props) => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" {...props}>
    <path
      d="M5 5l10 10M15 5 5 15"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const UploadIcon = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
    <path
      d="M12 15V4M12 4 8 8M12 4l4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" {...props}>
    <path
      d="M5 13l5 5L19 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
