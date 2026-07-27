import React from "react";
import { StatusBadge } from "../../../shared";
import { documentStatusMeta } from "../../../data";
import "./EnrollmentsTable.css";

/**
 * EnrollmentsTable
 *
 * Renders the candidate rows for whichever tab is active on the
 * Enrollments page (Pending vs Completed) inside a white card with a
 * column header row. Each row shows the document status as a
 * <StatusBadge> plus a small caption underneath it ("Documents
 * Pending" / "Documents Collected") looked up from
 * `documentStatusMeta` in /data, and a right-aligned primary action
 * button whose label comes from each row's own `action` field so the
 * same table works for both "Continue Enrollment" (pending) and "View
 * Enrollment" (completed) without any special-casing here.
 *
 * Props:
 *  - rows: array      -> enrollment records (pendingEnrollments or completedEnrollments)
 *  - onAction: function(row) -> fired when a row's action button is clicked
 */
const EnrollmentsTable = ({ rows = [], onAction }) => {
  return (
    <div className="enrollments-table">
      <div className="enrollments-table__scroll">
        <table className="enrollments-table__table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Candidate</th>
              <th>Course</th>
              <th>Location</th>
              <th>Documents</th>
              <th>Last Updated</th>
              <th className="enrollments-table__actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const meta =
                documentStatusMeta[row.documentStatus?.toLowerCase()] || {};

              return (
                <tr key={`${row.id}-${index}`}>
                  <td className="enrollments-table__id">{row.id}</td>
                  <td className="enrollments-table__candidate">
                    {row.candidate}
                  </td>
                  <td>{row.course}</td>
                  <td>{row.location}</td>
                  <td>
                    <StatusBadge status={row.documentStatus} />
                    {meta.caption && (
                      <p className="enrollments-table__caption">
                        · {meta.caption}
                      </p>
                    )}
                  </td>
                  <td className="enrollments-table__updated">
                    {row.lastUpdated}
                  </td>
                  <td className="enrollments-table__actions-cell">
                    <button
                      type="button"
                      className="enrollments-table__action-btn"
                      onClick={() => onAction && onAction(row)}
                    >
                      {row.action}
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="enrollments-table__empty">
                  No enrollments to show here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentsTable;
