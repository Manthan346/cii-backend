import { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import { fetchBatchDetails } from "../../../../../../api/trainer/batchService";
import "./ViewBatchModal.css";

/**
 * ViewBatchModal
 *
 * Popup opened by the Eye icon in the batch table's Action column.
 * `batch` (passed in from the row) only has list-level fields
 * (code/course/candidates/startDate/status), so on open this fetches
 * the rest (description, end date, max candidates, batch type) from
 * GET /instructor/batch-details/:batchId using batch.id.
 *
 * DEFENSIVE NOTE: the backend controller (getBatchDetails) does not
 * scope by instructor_id and does not 404 on a missing batch — it can
 * return `batchDetails: null`. This is handled here explicitly rather
 * than assuming a valid response, per instruction not to touch the
 * backend for this pass.
 */

const STATUS_LABEL_TO_TONE = {
  Active: "Active",
  Dropped: "Dropped",
  Upcoming: "Upcoming",
};

function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapBatchProfile(apiDetails) {
  return {
    description: apiDetails.batch_desc || "—",
    endDate: formatDate(apiDetails.batch_end_date),
    maxCandidates: apiDetails.max_candidates ?? "—",
    batchType: apiDetails.batch_type || "—",
  };
}

export default function ViewBatchModal({ batch, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!batch?.id) return;
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const apiDetails = await fetchBatchDetails(batch.id);
        if (cancelled) return;
        if (!apiDetails) {
          // Backend returns 200 + batchDetails: null instead of a 404.
          setNotFound(true);
        } else {
          setDetails(mapBatchProfile(apiDetails));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load batch details");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [batch?.id]);

  if (!batch) return null;

  // Merge: list-level fields shown immediately, detail fields filled
  // in once the fetch resolves (undefined -> '—' while loading).
  const view = { ...batch, ...details };

  return (
    <div
      className={"batch-management-view-batch-modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-label="Batch details"
      onClick={onClose}
    >
      <div
        className={"batch-management-view-batch-modal-modal"}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={"batch-management-view-batch-modal-close-btn"}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={"batch-management-view-batch-modal-header"}>
          <Layers
            size={32}
            className={"batch-management-view-batch-modal-icon"}
          />
          <div>
            <h2 className={"batch-management-view-batch-modal-name"}>
              {view.code}
            </h2>
            <p className={"batch-management-view-batch-modal-id"}>
              {view.course}
            </p>
          </div>
          <StatusBadge
            status={STATUS_LABEL_TO_TONE[view.status] ?? view.status}
          />
        </div>

        {notFound && (
          <p className={"batch-management-view-batch-modal-error"}>
            This batch's details couldn't be found. It may have been removed.
          </p>
        )}

        {error && (
          <p className={"batch-management-view-batch-modal-error"}>
            Couldn't load full details: {error}
          </p>
        )}

        {!notFound && (
          <div className={"batch-management-view-batch-modal-grid"}>
            <div className={"batch-management-view-batch-modal-field"}>
              <span className={"batch-management-view-batch-modal-label"}>
                Course
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {view.course}
              </span>
            </div>
            <div className={"batch-management-view-batch-modal-field"}>
              <span className={"batch-management-view-batch-modal-label"}>
                Candidates Enrolled
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {view.candidates}
              </span>
            </div>
            <div className={"batch-management-view-batch-modal-field"}>
              <span className={"batch-management-view-batch-modal-label"}>
                Start Date
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {view.startDate}
              </span>
            </div>
            <div className={"batch-management-view-batch-modal-field"}>
              <span className={"batch-management-view-batch-modal-label"}>
                End Date
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {loading ? "—" : view.endDate}
              </span>
            </div>
            <div className={"batch-management-view-batch-modal-field"}>
              <span className={"batch-management-view-batch-modal-label"}>
                Max Candidates
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {loading ? "—" : view.maxCandidates}
              </span>
            </div>
            <div className={"batch-management-view-batch-modal-field"}>
              <span className={"batch-management-view-batch-modal-label"}>
                Batch Type
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {loading ? "—" : view.batchType}
              </span>
            </div>
            <div
              className={
                "batch-management-view-batch-modal-field batch-management-view-batch-modal-field--full"
              }
            >
              <span className={"batch-management-view-batch-modal-label"}>
                Description
              </span>
              <span className={"batch-management-view-batch-modal-value"}>
                {loading ? "—" : view.description}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
