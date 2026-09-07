import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  X,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchAllMobilizerCandidates,
  fetchMobilizerCandidateDetails,
} from "../../../../../api/mobilizer/candidateService";
import "./Candidates.css";

const PAGE_SIZE = 50;
const STATUS_OPTIONS = [
  "All enrolled",
  "ACTIVE",
  "ENROLLED",
  "DROPPED",
  "BLACKLIST",
];
const NEW_CANDIDATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function displayValue(value) {
  return value || "Not available";
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status) {
  if (!status || status === "Not Enrolled") return "Not enrolled";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function candidateCreationTime(candidate) {
  const timestamp = Date.parse(candidate.candidate_creation_date || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isNewCandidate(candidate) {
  const created = candidateCreationTime(candidate);
  if (!created) return false;
  return Date.now() - created <= NEW_CANDIDATE_WINDOW_MS;
}

function CandidateDetails({ candidate, loading, error, onClose }) {
  if (!candidate) return null;

  const enrollment = candidate.enrollments?.[0];
  const batch = enrollment?.batch;
  const course = batch?.course;

  return (
    <div
      className="mobilizer-candidates__modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="mobilizer-candidates__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="mobilizer-candidates__close"
          onClick={onClose}
          aria-label="Close candidate details"
        >
          <X size={18} />
        </button>
        <div className="mobilizer-candidates__modal-heading">
          {candidate.profile_photo ? (
            <img
              src={candidate.profile_photo}
              alt=""
              className="mobilizer-candidates__avatar"
            />
          ) : (
            <div className="mobilizer-candidates__avatar mobilizer-candidates__avatar--fallback">
              {candidate.candidate_first_name?.[0] || "C"}
            </div>
          )}
          <div>
            <h2 id="candidate-details-title">
              {displayValue(
                `${candidate.candidate_first_name || ""} ${candidate.candidate_last_name || ""}`.trim(),
              )}
            </h2>
            <p>{displayValue(candidate.candidate_unique_id)}</p>
          </div>
        </div>

        {loading && (
          <p className="mobilizer-candidates__message">
            Loading candidate details...
          </p>
        )}
        {error && (
          <p className="mobilizer-candidates__message mobilizer-candidates__message--error">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mobilizer-candidates__detail-section">
              <h3 className="mobilizer-candidates__section-title">
                Personal details
              </h3>
              <div className="mobilizer-candidates__detail-grid">
                <Detail label="Contact number" value={candidate.contact_number} />
                <Detail label="Email" value={candidate.email} />
                <Detail
                  label="Date of birth"
                  value={formatDate(candidate.date_of_birth)}
                />
                <Detail label="Gender" value={candidate.gender} />
                <Detail
                  label="Highest qualification"
                  value={candidate.highest_qualification}
                />
                <Detail label="Category" value={candidate.category} />
                <Detail label="Blood group" value={candidate.blood_group} />
                <Detail label="Guardian" value={candidate.guardian_name} />
                <Detail
                  label="Current address"
                  value={candidate.candidate_current_address}
                />
              </div>
            </div>

            <div className="mobilizer-candidates__detail-section">
              <h3 className="mobilizer-candidates__section-title">
                Course & enrollment
              </h3>
              <div className="mobilizer-candidates__detail-grid">
                <Detail label="Course" value={course?.courseName} />
                <Detail label="Batch" value={batch?.batchName} />
                <Detail
                  label="Enrollment date"
                  value={formatDate(enrollment?.enrollmentDate)}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
function Detail({ label, value }) {
  return (
    <div className="mobilizer-candidates__detail">
      <span>{label}</span>
      <strong>{displayValue(value)}</strong>
    </div>
  );
}

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All enrolled");
  const [course, setCourse] = useState("All courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchAllMobilizerCandidates()
      .then((result) => {
        if (!active) return;
        const enrolledCandidates = result
          .filter((candidate) => candidate.enrollment_status !== "Not Enrolled")
          .sort((first, second) => {
            const dateDifference =
              candidateCreationTime(second) - candidateCreationTime(first);

            if (dateDifference !== 0) return dateDifference;

            return String(second.candidate_id).localeCompare(
              String(first.candidate_id),
              undefined,
              { numeric: true },
            );
          });
        setCandidates(enrolledCandidates);
        setPagination({
          page,
          totalPages: Math.max(
            1,
            Math.ceil(enrolledCandidates.length / PAGE_SIZE),
          ),
          totalRecords: enrolledCandidates.length,
        });
      })
      .catch(() => active && setError("Unable to load enrolled candidates."))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const courseOptions = useMemo(
    () => [
      "All courses",
      ...new Set(
        candidates.map((candidate) => candidate.course_name).filter(Boolean),
      ),
    ],
    [candidates],
  );

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        [
          candidate.full_name,
          candidate.candidate_unique_id,
          candidate.contact_number,
          candidate.email_id,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );
      const matchesStatus =
        status === "All enrolled" || candidate.enrollment_status === status;
      const matchesCourse =
        course === "All courses" || candidate.course_name === course;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [candidates, course, search, status]);

  const visibleCandidates = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCandidates.slice(start, start + PAGE_SIZE);
  }, [filteredCandidates, page]);

  useEffect(() => {
    setPage(1);
  }, [course, search, status]);

  useEffect(() => {
    setPagination((current) => ({
      ...current,
      totalPages: Math.max(1, Math.ceil(filteredCandidates.length / PAGE_SIZE)),
      totalRecords: filteredCandidates.length,
    }));
  }, [filteredCandidates.length]);

  const openDetails = async (candidate) => {
    setSelectedId(candidate.candidate_id);
    setSelectedCandidate(candidate);
    setDetailLoading(true);
    setDetailError("");
    try {
      const details = await fetchMobilizerCandidateDetails(
        candidate.candidate_id,
      );
      setSelectedCandidate(details);
    } catch {
      setDetailError("Unable to load candidate details.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="mobilizer-candidates">
      <header className="mobilizer-candidates__header">
        <div>
          <p className="mobilizer-candidates__eyebrow">Mobilizer workspace</p>
          <h1>Enrolled candidates</h1>
          <p>
            Review candidates enrolled through your center and open their
            profile details.
          </p>
        </div>
        <div className="mobilizer-candidates__count">
          <Users size={16} />
          <div>
            <strong>{pagination.totalRecords || candidates.length}</strong>
            <span>Enrolled candidates</span>
          </div>
        </div>
      </header>

      <section
        className="mobilizer-candidates__filters"
        aria-label="Candidate filters"
      >
        <label className="mobilizer-candidates__search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, ID, phone or email"
          />
          {search && (
            <button
              type="button"
              className="mobilizer-candidates__search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by enrollment status"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {statusLabel(option)}
            </option>
          ))}
        </select>
        <select
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          aria-label="Filter by course"
        >
          {courseOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <p className="mobilizer-candidates__message mobilizer-candidates__message--error">
          {error}
        </p>
      )}
      {loading ? (
        <p className="mobilizer-candidates__message">
          Loading enrolled candidates...
        </p>
      ) : (
        <section className="mobilizer-candidates__table-wrap">
          <div className="mobilizer-candidates__table-toolbar">
            <div>
              <strong>{filteredCandidates.length}</strong> enrolled candidates
              <span>Newest enrollments show first</span>
            </div>
            <span>
              Showing{" "}
              {visibleCandidates.length ? (page - 1) * PAGE_SIZE + 1 : 0}-
              {Math.min(page * PAGE_SIZE, filteredCandidates.length)} of{" "}
              {filteredCandidates.length}
            </span>
          </div>
          <div className="mobilizer-candidates__table-scroll">
            <table className="mobilizer-candidates__table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Candidate ID</th>
                  <th>Created</th>
                  <th>Contact</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visibleCandidates.map((candidate) => (
                  <tr key={candidate.candidate_id}>
                    <td>
                      <div className="mobilizer-candidates__name-cell">
                        <strong>{candidate.full_name}</strong>
                        {isNewCandidate(candidate) && (
                          <span className="mobilizer-candidates__new-badge">
                            <Sparkles size={11} />
                            New
                          </span>
                        )}
                      </div>
                      <span>{candidate.email_id || "No email"}</span>
                    </td>
                    <td>{candidate.candidate_unique_id}</td>
                    <td>{formatDate(candidate.candidate_creation_date)}</td>
                    <td>{candidate.contact_number}</td>
                    <td>{candidate.course_name}</td>
                    <td>{candidate.batch_name}</td>
                    <td>
                      <span
                        className={`mobilizer-candidates__status mobilizer-candidates__status--${candidate.enrollment_status.toLowerCase()}`}
                      >
                        {statusLabel(candidate.enrollment_status)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="mobilizer-candidates__view"
                        onClick={() => openDetails(candidate)}
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleCandidates.length && (
              <p className="mobilizer-candidates__empty">
                No enrolled candidates match these filters. Try adjusting your
                search or filters.
              </p>
            )}
          </div>
        </section>
      )}

      <footer className="mobilizer-candidates__pagination">
        <span>
          Page {page} of {Math.max(1, pagination.totalPages || 1)}
        </span>
        <div>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            type="button"
            onClick={() =>
              setPage((current) =>
                Math.min(pagination.totalPages || 1, current + 1),
              )
            }
            disabled={page >= (pagination.totalPages || 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      <CandidateDetails
        candidate={selectedId ? selectedCandidate : null}
        loading={detailLoading}
        error={detailError}
        onClose={() => {
          setSelectedId(null);
          setSelectedCandidate(null);
        }}
      />
    </div>
  );
}

export default Candidates;