import React, { useRef, useState } from "react";
import { UserRound, MoreVertical, Upload } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Button from "../../shared/Button/Button";
import Pagination from "../../shared/Pagination/Pagination";
import "./CandidatesTable.css";

/**
 * CandidatesTable
 *
 * "All Candidates - N results" list: selectable rows, candidate
 * identity, course/batch, attendance percentage, certificate status,
 * row actions, and pagination. Rows with no course assigned yet (e.g.
 * a freshly-registered candidate) render "—" for course/batch/
 * attendance/certificate, matching the reference design.
 *
 * Props:
 *  - candidates: array of { id, candidateId, name, course, batch,
 *                attendance, certificate } - see data/candidatesData.js
 *                -> candidatesList for the shape. `course`/`batch`/
 *                `attendance`/`certificate` may be null.
 *  - pagination: { currentPage, totalPages, pageSize, totalResults }
 *  - onPageChange: function(page)
 *  - onAddCandidate: function -> "Add Candidate" button
 *  - onViewCandidate / onEditCandidate / onRowMenu: function(id)
 *  - selectedIds: array of selected row ids
 *  - onToggleSelect: function(id)
 *  - onToggleSelectAll: function
 */
const CandidatesTable = ({
  candidates = [],
  pagination = {},
  onPageChange,
  onUploadCertificate,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const fileInputRefs = useRef({});
  const {
    currentPage = 1,
    totalPages = 1,
    pageSize = candidates.length,
    totalResults = candidates.length,
  } = pagination;

  const isSelected = (id) => selectedIds.includes(id);
  const allSelected =
    candidates.length > 0 && candidates.every((c) => isSelected(c.id));

  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <SectionCard
      title={`All Candidates-${totalResults.toLocaleString()} results`}
    >
      <div className="admin-table-wrap">
        <table className="admin-candidates-table">
          <thead>
            <tr>
              <th>candidate ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Attendance</th>
              <th>Certificates</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="admin-candidates-table__candidate-id">
                  {candidate.candidateId}
                </td>
                <td>
                  <div className="admin-candidates-table__name">
                    <span className="admin-candidates-table__avatar">
                      <UserRound size={15} strokeWidth={2} />
                    </span>
                    {candidate.name}
                  </div>
                </td>
                <td>{candidate.course || "—"}</td>
                <td>{candidate.batch || "—"}</td>
                <td>
                  {candidate.attendance != null
                    ? `${candidate.attendance}%`
                    : "—"}
                </td>
                <td>
                  {candidate.certificate === "issued" && (
                    <span className="admin-candidates-table__cert admin-candidates-table__cert--issued">
                      Issued
                    </span>
                  )}
                  {candidate.certificate === "not-issued" && (
                    <span className="admin-candidates-table__cert admin-candidates-table__cert--pending">
                      Not Issued
                    </span>
                  )}
                  {!candidate.certificate && "—"}
                </td>
                <td>
                  <div className="admin-candidates-table__row-actions">
                    <button
                      type="button"
                      className="admin-candidates-table__icon-btn"
                      onClick={() =>
                        setOpenMenuId((currentId) =>
                          currentId === candidate.id ? null : candidate.id,
                        )
                      }
                      aria-label={`More actions for ${candidate.name}`}
                      aria-expanded={openMenuId === candidate.id}
                    >
                      <MoreVertical size={15} strokeWidth={2} />
                    </button>
                    {openMenuId === candidate.id && (
                      <div className="admin-candidates-table__menu">
                        <button
                          type="button"
                          className="admin-candidates-table__menu-item"
                          onClick={() =>
                            fileInputRefs.current[candidate.id]?.click()
                          }
                          disabled={candidate.certificate === "issued"}
                        >
                          <Upload size={14} strokeWidth={2} />
                          {candidate.certificate === "issued"
                            ? "Certificate issued"
                            : "Upload certificate"}
                        </button>
                        {candidate.certificate !== "issued" && (
                          <span className="admin-candidates-table__menu-warning">
                            PDF only, maximum size 5 MB
                          </span>
                        )}
                        <input
                          ref={(element) => {
                            fileInputRefs.current[candidate.id] = element;
                          }}
                          type="file"
                          accept="application/pdf,.pdf"
                          hidden
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            setOpenMenuId(null);
                            onUploadCertificate?.(candidate, file);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-candidates-table__footer">
        <span className="admin-candidates-table__showing">
          Showing {rangeStart}-{rangeEnd} of {totalResults.toLocaleString()}{" "}
          Users
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </SectionCard>
  );
};

export default CandidatesTable;
