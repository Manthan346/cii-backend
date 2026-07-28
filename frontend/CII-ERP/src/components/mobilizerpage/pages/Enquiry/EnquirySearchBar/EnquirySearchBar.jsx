import React, { useState } from "react";
import { Search, ChevronDown, Calendar, Download } from "lucide-react";
import { courseFilterOptions } from "../../../data";
import "./EnquirySearchBar.css";

/**
 * EnquirySearchBar
 *
 * White toolbar card above the Enquiries table: free-text search by
 * name/ID on the left, and a course dropdown + date filter + "Export
 * CSV" action on the right. Kept fully controlled-optional: the parent
 * <Enquiry> page can wire `onSearch`/`onCourseChange`/`onDateChange` to
 * actually filter the table, or leave them out for a static demo.
 *
 * Props:
 *  - onSearch: function(string)
 *  - onCourseChange: function(string)
 *  - onDateChange: function(string)
 *  - onExport: function()
 */
const EnquirySearchBar = ({
  onSearch,
  onCourseChange,
  onDateChange,
  onExport,
}) => {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState(courseFilterOptions[0]);
  const [date, setDate] = useState("");

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
    onCourseChange && onCourseChange(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onDateChange && onDateChange(e.target.value);
  };

  return (
    <div className="enquiry-search-bar">
      <div className="enquiry-search-bar__search">
        <Search size={18} strokeWidth={2} className="enquiry-search-bar__search-icon" />
        <input
          type="text"
          className="enquiry-search-bar__search-input"
          placeholder="Search Candidates by Name & ID..."
          value={query}
          onChange={handleQueryChange}
          aria-label="Search candidates by name or ID"
        />
      </div>

      <div className="enquiry-search-bar__filters">
        <div className="enquiry-search-bar__select-wrap">
          <select
            className="enquiry-search-bar__select"
            value={course}
            onChange={handleCourseChange}
            aria-label="Filter by course"
          >
            {courseFilterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="enquiry-search-bar__select-icon" />
        </div>

        <div className="enquiry-search-bar__date-wrap">
          <input
            type="text"
            className="enquiry-search-bar__date-input"
            placeholder="DD/MM/YYYY"
            value={date}
            onChange={handleDateChange}
            aria-label="Filter by enquiry date"
          />
          <Calendar size={16} className="enquiry-search-bar__date-icon" />
        </div>

        <button
          type="button"
          className="enquiry-search-bar__export"
          onClick={onExport}
        >
          <Download size={16} strokeWidth={2} />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default EnquirySearchBar;
