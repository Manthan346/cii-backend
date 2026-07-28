// Dummy data for the Study Material Upload page.
// Replace with API responses later, e.g.
//   GET /api/materials/stats        -> materialStats
//   GET /api/materials?page=1       -> materialRecords

// ---- Summary cards: Total Materials / Published / Pending review / Storage used ----
export const materialStats = [
  {
    id: "total",
    label: "Total Materials",
    value: 168,
    icon: "grid",
    tone: "teal",
  },
  {
    id: "published",
    label: "Published",
    value: 142,
    icon: "check",
    tone: "green",
  },
  {
    id: "pending",
    label: "Pending review",
    value: 19,
    icon: "dots",
    tone: "peach",
  },
  {
    id: "storage",
    label: "Storage used",
    value: "3.1 GB",
    icon: "coins",
    tone: "yellow",
  },
];

// ---- Page-level meta (header subtitle, pagination) ----
export const materialMeta = {
  totalActiveBatches: 6,
  totalMaterials: 168,
  totalPages: 14,
};

// ---- "All Materials" table rows ----
export const materialRecords = [
  {
    id: 1,
    name: "cyber security module 6- Notes.pdf",
    course: "cyber security",
    type: "PDF",
    uploadedBy: "Rohit mehta",
    date: "07 july 2026",
    size: "3.2 MB",
    status: "Published",
  },
  {
    id: 2,
    name: "japanese language - recorded session.mp4",
    course: "Japanese language",
    type: "Video",
    uploadedBy: "Anjali rane",
    date: "03 july 2026",
    size: "412 MB",
    status: "Published",
  },
  {
    id: 3,
    name: "Artificial intelligence- week 5 slides.pptx",
    course: "Artificial intelligence",
    type: "PPT",
    uploadedBy: "Karan bhosale",
    date: "17 jun 2026",
    size: "5.2 MB",
    status: "Pending review",
  },
  {
    id: 4,
    name: "Graphic designing module 1.docx",
    course: "Graphic design",
    type: "DOC",
    uploadedBy: "Priya joshi",
    date: "6 jun 2026",
    size: "3.2 MB",
    status: "Draft",
  },
];
