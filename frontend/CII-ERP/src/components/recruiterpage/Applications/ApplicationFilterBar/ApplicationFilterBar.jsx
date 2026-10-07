import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import "./ApplicationFilterBar.css";

const EMPTY_DRAFT = { search: "", status: "", from: "", to: "" };
const APPLICATION_STATUSES = [
  ["APPLIED", "Applied"],
  ["SCREENING", "Screening"],
  ["SHORTLISTED", "Shortlisted"],
  ["INTERVIEW", "Interview"],
  ["SELECTED", "Selected"],
  ["REJECTED", "Rejected"],
  ["WITHDRAWN", "Withdrawn"],
];

/**
 * ApplicationFilterBar
 *
 * Search box + Status dropdown + From/To date range.
 * Filter changes are passed to the parent immediately.
 */
const ApplicationFilterBar = ({ onFilterChange }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const handleChange = (key) => (event) => {
    const nextDraft = { ...draft, [key]: event.target.value };
    setDraft(nextDraft);
    onFilterChange?.(nextDraft);
  };

  return (
    <div className="application-filter-bar">
      <div className="application-filter-bar__fields">
        <div className="application-filter-bar__field application-filter-bar__field--search">
          <Search size={16} className="application-filter-bar__search-icon" />
          <input
            type="text"
            placeholder="Search candidate, company, or role..."
            value={draft.search}
            onChange={handleChange("search")}
            className="application-filter-bar__search-input"
          />
        </div>

        <div className="application-filter-bar__field">
          <select
            value={draft.status}
            onChange={handleChange("status")}
            className="application-filter-bar__select"
          >
            <option value="">Status</option>
            {APPLICATION_STATUSES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="application-filter-bar__chevron"
            aria-hidden="true"
          />
        </div>

        <div className="application-filter-bar__field application-filter-bar__field--date">
          <span className="application-filter-bar__date-label">From</span>
          <input
            type="date"
            value={draft.from}
            onChange={handleChange("from")}
            className="application-filter-bar__date-input"
          />
        </div>

        <div className="application-filter-bar__field application-filter-bar__field--date">
          <span className="application-filter-bar__date-label">To</span>
          <input
            type="date"
            value={draft.to}
            onChange={handleChange("to")}
            className="application-filter-bar__date-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilterBar;
