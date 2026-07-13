// ============================================================================
// JobFiltersBar.jsx
// ----------------------------------------------------------------------------
// The "Filters | Location | Type | Roles | Sort by" pill row.
//
// This is UI scaffolding: the dropdowns don't open a menu yet (no design
// reference was given for their open state), but each button already
// carries the data + handler wiring you'll need:
//
// BACKEND / STATE NOTE: lift real filter state up into JobOpportunities.jsx
// (e.g. { location, type, role, sort }), pass the active value + an
// onChange-style callback down as props here, and re-fetch
// GET /api/candidates/:id/job-opportunities?location=&type=&role=&sort=
// whenever a filter changes. The `onOpenFilters` / `onOpenDropdown` props
// below are where you'd toggle an actual dropdown/menu component.
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import { jobFilterOptions } from "../../../../../data/jobOpportunitiesData";
import "./JobFiltersBar.css";

const JobFiltersBar = ({
  hasActiveIndicator = jobFilterOptions.hasActiveIndicator,
  filters = jobFilterOptions.filters,
  sort = jobFilterOptions.sort,
  onOpenFilters,
  onOpenDropdown,
}) => {
  return (
    <div className="job-filters-bar">
      <button
        type="button"
        className="job-filters-bar__filters-pill"
        onClick={() => onOpenFilters && onOpenFilters()}
      >
        <Icon name="filter" size={15} color="currentColor" />
        Filters
        {hasActiveIndicator && <span className="job-filters-bar__dot" aria-hidden="true" />}
      </button>

      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className="job-filters-bar__dropdown-pill"
          onClick={() => onOpenDropdown && onOpenDropdown(filter.id)}
        >
          {filter.label}
          <Icon name="chevronDown" size={14} color="currentColor" />
        </button>
      ))}

      {sort && (
        <button
          type="button"
          className="job-filters-bar__dropdown-pill"
          onClick={() => onOpenDropdown && onOpenDropdown(sort.id)}
        >
          <Icon name="sort" size={14} color="currentColor" />
          {sort.label}
        </button>
      )}
    </div>
  );
};

export default JobFiltersBar;
