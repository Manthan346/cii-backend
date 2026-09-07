import React, { useState } from "react";
import { Calendar, ChevronDown, FileSpreadsheet, Loader2 } from "lucide-react";
import "./ReportsFilterBar.css";

/**
 * ReportsFilterBar
 *
 * From/To (month + year) + course dropdown + "Export Excel" action.
 * Used twice on the Reports & Analytics page — once for the
 * Enrollment report, once for the Enquiry report — each pointed at
 * its own export handler (downloadEnrollmentReport /
 * downloadEnquiryReport), since those are separate backend endpoints
 * with their own file outputs, not a single shared "Apply Filters".
 *
 * Props:
 *  - title: string heading shown above the bar (e.g. "Total Enrollments")
 *  - courseOptions: [{ value, label }]
 *  - onExport: ({ fromMonth, fromYear, toMonth, toYear, courseId }) => Promise
 *  - exporting: bool — disables the button and shows a spinner while true
 */
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_FROM = `${CURRENT_YEAR}-01`;
const DEFAULT_TO = `${CURRENT_YEAR}-12`;

export default function ReportsFilterBar({
  title,
  courseOptions = [],
  onExport,
  exporting = false,
}) {
  const [from, setFrom] = useState(DEFAULT_FROM); // "YYYY-MM" from <input type="month">
  const [to, setTo] = useState(DEFAULT_TO);
  const [course, setCourse] = useState(courseOptions[0]?.value ?? "all");
  const [error, setError] = useState("");

  const handleExport = async () => {
    setError("");

    if (!from || !to) {
      setError("Select both a From and To month.");
      return;
    }

    const [fromYear, fromMonth] = from.split("-");
    const [toYear, toMonth] = to.split("-");

    try {
      await onExport?.({
        fromMonth,
        fromYear,
        toMonth,
        toYear,
        courseId: course,
      });
    } catch (err) {
      setError(err?.message || "Unable to export the report right now.");
    }
  };

  return (
    <div className="ra-filterbar-section">
      {title && <h2 className="ra-filterbar-section__title">{title}</h2>}

      <div className="ra-filterbar">
        <div className="ra-filterbar__field">
          <span className="ra-filterbar__group-label">Date range</span>
          <div className="ra-filterbar__row">
            <label className="ra-filterbar__date">
              <span className="ra-filterbar__label">From</span>
              <span className="ra-filterbar__input-wrap">
                <Calendar size={16} className="ra-filterbar__icon" />
                <input
                  type="month"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </span>
            </label>

            <label className="ra-filterbar__date">
              <span className="ra-filterbar__label">To</span>
              <span className="ra-filterbar__input-wrap">
                <Calendar size={16} className="ra-filterbar__icon" />
                <input
                  type="month"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </span>
            </label>
          </div>
        </div>

        <label className="ra-filterbar__field">
          <span className="ra-filterbar__group-label">Courses</span>
          <span className="ra-filterbar__select-wrap">
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              {courseOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ra-filterbar__chevron" />
          </span>
        </label>

        <button
          type="button"
          className="ra-btn ra-btn--primary ra-filterbar__apply"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? (
            <Loader2 size={16} className="ra-filterbar__spin" />
          ) : (
            <FileSpreadsheet size={16} />
          )}
          {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>

      {error && <p className="ra-filterbar-section__error">{error}</p>}
    </div>
  );
}
