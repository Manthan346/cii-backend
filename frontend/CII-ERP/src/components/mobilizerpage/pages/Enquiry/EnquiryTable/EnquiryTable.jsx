import React from "react";
import { Eye } from "lucide-react";
import { Avatar, StatusBadge } from "../../../shared";
import "./EnquiryTable.css";

/**
 * EnquiryTable
 *
 * Renders the candidate rows for the Enquiries page inside a white
 * card with a column header row: Name (avatar initials + candidate
 * name + enquiry ID), Course, Area, Enquiry Date, Contact, Status
 * (shared <StatusBadge>), and a trailing "view details" eye icon.
 * Reuses the same <Avatar>/<StatusBadge> shared components as the
 * Dashboard's Today's Follow-ups and the Enrollments table so the
 * "person row with a status pill" look stays consistent everywhere.
 *
 * Props:
 *  - rows: array               -> candidate enquiry records (see data/enquiryData.js)
 *  - onViewCandidate: function(row) -> fired when a row's eye icon is clicked
 */
const EnquiryTable = ({ rows = [], onViewCandidate }) => {
  return (
    <div className="enquiry-table">
      <div className="enquiry-table__scroll">
        <table className="enquiry-table__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Area</th>
              <th>Enquiry Date</th>
              <th>Contact</th>
              <th>Status</th>
              <th className="enquiry-table__actions-head" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.id}-${index}`}>
                <td>
                  <div className="enquiry-table__name-cell">
                    <Avatar name={row.name} tone="navy" size={38} />
                    <div>
                      <p className="enquiry-table__name">{row.name}</p>
                      <p className="enquiry-table__id">ID-{row.id}</p>
                    </div>
                  </div>
                </td>
                <td>{row.course}</td>
                <td>{row.area}</td>
                <td className="enquiry-table__date">{row.enquiryDate}</td>
                <td className="enquiry-table__contact">{row.contact}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td className="enquiry-table__actions-cell">
                  <button
                    type="button"
                    className="enquiry-table__view-btn"
                    onClick={() => onViewCandidate && onViewCandidate(row)}
                    aria-label={`View ${row.name}`}
                  >
                    <Eye size={17} strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="enquiry-table__empty">
                  No candidates match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryTable;
