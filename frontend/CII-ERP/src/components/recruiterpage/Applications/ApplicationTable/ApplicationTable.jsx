import React from "react";
import { Eye } from "lucide-react";
import StatusSelect from "../../shared/StatusSelect/StatusSelect";
import RowActionsMenu from "../../shared/RowActionsMenu/RowActionsMenu";
import { applicationsPageStatusStyles } from "../../data";
import { applicationStatusOptions } from "../../../../../api/recruiter/applicationService";
import "./ApplicationTable.css";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * ApplicationTable
 *
 * Status is now editable via StatusSelect (same pattern as the Events
 * table) — onStatusChange(candidateId, nextStatus) bubbles up to
 * Applications.jsx, which calls the backend and refetches.
 *
 * NOTE: "Applied" is intentionally excluded from applicationStatusOptions
 * (see applicationService.js) since it's not a valid target for a
 * status PATCH — it's only ever the initial state. If a candidate's
 * current status IS "Applied", the dropdown will show it as selected
 * but won't offer it as an option to select back into once changed.
 */
const ApplicationTable = ({ applications, onViewProfile, onStatusChange }) => {
  const handlePreview = (candidate) => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="application-table">
      <table className="application-table__table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job Role</th>
            <th>Company</th>
            <th>Contact No.</th>
            <th>Applied Date</th>
            <th>Resume</th>
            <th>Source</th>
            <th>Status</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {applications.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <div className="application-table__candidate">
                  <span
                    className="application-table__avatar"
                    style={{ backgroundColor: candidate.avatarColor }}
                  >
                    {getInitials(candidate.name)}
                  </span>
                  {candidate.name}
                </div>
              </td>
              <td className="application-table__role">{candidate.jobRole}</td>
              <td>
                <span className="application-table__company">
                  {candidate.company}
                </span>
              </td>
              <td>{candidate.contactNo}</td>
              <td>{candidate.appliedDate}</td>
              <td>
                <button
                  type="button"
                  className="application-table__preview-btn"
                  onClick={() => handlePreview(candidate)}
                  disabled={!candidate.resumeUrl}
                  title={
                    candidate.resumeUrl
                      ? "Open resume in a new tab"
                      : "No resume on file"
                  }
                >
                  Preview
                </button>
              </td>
              <td>{candidate.source}</td>
              <td>
                <StatusSelect
                  value={candidate.status}
                  options={
                    applicationStatusOptions.includes(candidate.status)
                      ? applicationStatusOptions
                      : [candidate.status, ...applicationStatusOptions]
                  }
                  stylesMap={applicationsPageStatusStyles}
                  onChange={(nextStatus) =>
                    onStatusChange(candidate.id, nextStatus)
                  }
                />
              </td>
              <td className="application-table__actions">
                <RowActionsMenu
                  items={[
                    {
                      id: "view-profile",
                      label: "View Profile",
                      icon: Eye,
                      onClick: () => onViewProfile(candidate.id),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}

          {applications.length === 0 && (
            <tr>
              <td colSpan={9} className="application-table__empty">
                No applications match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
