// Dummy data for the Study Material Upload page.
// Replace with API responses later, e.g.
//   GET /api/materials/stats        -> materialStats
//   GET /api/materials?page=1       -> materialRecords

// ---- Summary cards: Total Materials / Published / Pending review ----
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
    batch: "DS-24",
    type: "PDF",
    uploadedBy: "Rohit mehta",
    date: "07 july 2026",
    size: "3.2 MB",
    status: "Published",
  },
  {
    id: 2,
    name: "japanese language - recorded session.mp4",
    batch: "PY-18",
    type: "Video",
    uploadedBy: "Anjali rane",
    date: "03 july 2026",
    size: "412 MB",
    status: "Published",
  },
  {
    id: 3,
    name: "Artificial intelligence- week 5 slides.pptx",
    batch: "DS-18",
    type: "PPT",
    uploadedBy: "Karan bhosale",
    date: "17 jun 2026",
    size: "5.2 MB",
    status: "Pending review",
  },
  {
    id: 4,
    name: "Graphic designing module 1.docx",
    batch: "BC-18",
    type: "DOC",
    uploadedBy: "Priya joshi",
    date: "6 jun 2026",
    size: "3.2 MB",
    status: "Draft",
  },
];
