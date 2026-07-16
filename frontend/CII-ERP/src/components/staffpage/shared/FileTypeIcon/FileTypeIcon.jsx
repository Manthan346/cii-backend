import React from "react";
import { FileText, FileSpreadsheet, File } from "lucide-react";
import "./FileTypeIcon.css";

/**
 * FileTypeIcon
 *
 * Maps a file extension/type ("pdf", "pptx", "doc"...) to a colored
 * square icon, matching the little file-type chips used for uploaded
 * material. Needed on the Dashboard's Recent Uploads list, but also
 * on Resources / Study Material Upload pages, so it lives in /shared.
 *
 * Props:
 *  - type: string -> "pdf" | "pptx" | "ppt" | "doc" | "docx" | "xlsx" | "xls" (falls back to a generic file icon)
 */
const TYPE_CONFIG = {
  pdf: { icon: FileText, tone: "red", label: "PDF" },
  ppt: { icon: FileText, tone: "orange", label: "PPT" },
  pptx: { icon: FileText, tone: "orange", label: "PPTX" },
  doc: { icon: FileText, tone: "blue", label: "DOC" },
  docx: { icon: FileText, tone: "blue", label: "DOCX" },
  xls: { icon: FileSpreadsheet, tone: "green", label: "XLS" },
  xlsx: { icon: FileSpreadsheet, tone: "green", label: "XLSX" },
};

const FileTypeIcon = ({ type }) => {
  const config = TYPE_CONFIG[type?.toLowerCase()] || {
    icon: File,
    tone: "grey",
    label: "FILE",
  };
  const Icon = config.icon;

  return (
    <span
      className={`file-type-icon file-type-icon--${config.tone}`}
      aria-label={config.label}
      title={config.label}
    >
      <Icon size={17} strokeWidth={2} />
    </span>
  );
};

export default FileTypeIcon;
