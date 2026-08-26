import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./MarkAssessment.css";

// Local-only mock list — no backend endpoint exists yet for
// per-candidate task completion. Toggling a status here only updates
// local component state; replace with a real API call once that
// endpoint is confirmed.
const DEFAULT_CANDIDATES = [
  { id: 1, name: "Nitu Patil", notified: true, status: "Completed" },
  { id: 2, name: "Ravi Deshmukh", notified: false, status: "Incomplete" },
  { id: 3, name: "Kirti mehta", notified: true, status: "Completed" },
  { id: 4, name: "Vaishnavi Rane", notified: true, status: "Completed" },
  { id: 5, name: "Karan wagh", notified: true, status: "Completed" },
  { id: 6, name: "Sumedh wagh", notified: true, status: "Incomplete" },
  { id: 7, name: "Raj thakur", notified: false, status: "Incomplete" },
  { id: 8, name: "Nitu Patil", notified: true, status: "Completed" },
];

export default function MarkAssessment({ task, onBack }) {
  const [candidates, setCandidates] = useState(DEFAULT_CANDIDATES);

  const completedCount = candidates.filter(
    (c) => c.status === "Completed",
  ).length;

  const setStatus = (id, status) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  };

  return (
    <div className="mark-assessment-page">
      <button
        type="button"
        className="mark-assessment-back-btn"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mark-assessment-header">
        <h1 className="mark-assessment-title">
          Mark assesment{task ? ` — ${task.title}` : ""}
        </h1>
        <span className="mark-assessment-count-badge">
          Completed : {completedCount}/{candidates.length}
        </span>
      </div>

      <div className="mark-assessment-table-wrap">
        <table className="mark-assessment-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Completion Notification</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.notified ? "Notified" : "-Not Notified"}</td>
                <td>
                  <div className="mark-assessment-status-buttons">
                    <button
                      type="button"
                      className={`mark-assessment-status-btn mark-assessment-status-btn--completed ${
                        c.status === "Completed" ? "is-active" : ""
                      }`}
                      onClick={() => setStatus(c.id, "Completed")}
                    >
                      Completed
                    </button>
                    <button
                      type="button"
                      className={`mark-assessment-status-btn mark-assessment-status-btn--incomplete ${
                        c.status === "Incomplete" ? "is-active" : ""
                      }`}
                      onClick={() => setStatus(c.id, "Incomplete")}
                    >
                      Incomplete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
