import React, { useEffect, useState } from "react";
import { UserRound, CheckCircle2, Clock, Phone } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { FilterBar, Pagination } from "../../../shared";
import StatCard from "../StatCard/StatCard";
import CandidateTable from "../CandidateTable/CandidateTable";
import {
  fetchCandidateOverview,
  fetchCandidateStats,
  updateCandidateStatus,
  fetchCandidateProfile,
  fetchCoursesAndBatches,
} from "../../../../../../api/trainer/candidateService";
import { statusOptions } from "../../../data/filterOptions";
// import { fetchCandidateOverview } from '../../../../../../api/trainer/candidateService';
import "../../../styles/variables.css";
import "./CandidateManagement.css";

const STAT_ICONS = {
  user: UserRound,
  check: CheckCircle2,
  clock: Clock,
  phone: Phone,
};
const PAGE_LIMIT = 6;

function mapCandidate(apiCandidate) {
  return {
    id: apiCandidate.enrollment_id,
    candidateId: apiCandidate.candidate_batch_id,
    name: apiCandidate.candidate_name,
    batch: apiCandidate.batch_code,
    course: apiCandidate.course_name,
    contact: apiCandidate.contact_number,
    joinDate: formatDate(apiCandidate.enrollment_date),
    status: formatStatus(apiCandidate.enrollment_status),
    // NOT returned by this endpoint — ViewCandidateModal fields below
    // will show as empty until a candidate-detail endpoint exists:
    progress: undefined,
    attendance: undefined,
    highestQualification: undefined,
    category: undefined,
    fatherName: undefined,
    email: undefined,
    dateOfBirth: undefined,
    bloodGroup: undefined,
  };
}

function mapCandidateProfile(apiProfile) {
  return {
    name: apiProfile.candidate_name,
    candidateId: apiProfile.candidate_batch_id,
    contact: apiProfile.phone_no,
    email: apiProfile.email_id,
    bloodGroup: apiProfile.blood_group,
    gender: apiProfile.gender,
    fatherName: apiProfile.guardian_name,
    guardianPhone: apiProfile.guardian_phone_no,
    highestQualification: apiProfile.highest_qualification,
    dateOfBirth: formatDate(apiProfile.date_of_birth),
    category: apiProfile.category,
    address: apiProfile.address,
    pinCode: apiProfile.pin_code,
    attendance: apiProfile.attendancePercentage,
  };
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g. "12 Jan 2026"
}

function formatStatus(enrollmentStatus) {
  if (!enrollmentStatus) return "—";
  const s = enrollmentStatus.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1); // "ACTIVE" -> "Active"
}

const CandidateManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCandidates: 0,
    limit: PAGE_LIMIT,
  });
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [batchLabels, setBatchLabels] = useState(["All Batches"]);
  const [courseLabels, setCourseLabels] = useState(["All Courses"]);
  const [batchLabelToId, setBatchLabelToId] = useState({});
  const [courseLabelToId, setCourseLabelToId] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function loadFilterOptions() {
      try {
        const { batches, courses } = await fetchCoursesAndBatches();
        if (cancelled) return;

        setBatchLabels(["All Batches", ...batches.map((b) => b.batch_code)]);
        setBatchLabelToId(
          Object.fromEntries(batches.map((b) => [b.batch_code, b.batchId])),
        );

        setCourseLabels(["All Courses", ...courses.map((c) => c.course_name)]);
        setCourseLabelToId(
          Object.fromEntries(courses.map((c) => [c.course_name, c.course_id])),
        );
      } catch (err) {
        console.error("Failed to load batch/course filter options:", err);
      }
    }
    loadFilterOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCandidateOverview({
          page: pagination.currentPage,
          limit: PAGE_LIMIT,
          status: filters.status,
          search: filters.search,
          batchId: filters.batchId,
        });
        if (!cancelled) {
          setCandidates(data.candidates.map(mapCandidate));
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load candidates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [pagination.currentPage, filters, refreshKey]);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      setStatsLoading(true);
      try {
        const summary = await fetchCandidateStats();
        if (!cancelled) setStats(summary);
      } catch (err) {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyFilter = ({ status, searchTerm, batch }) => {
    setPagination((p) => ({ ...p, currentPage: 1 }));
    setFilters({
      status,
      search: searchTerm,
      batchId: batchLabelToId[batch] ?? null, // undefined/'All Batches' -> null, meaning "no filter"
    });
  };

  const handlePageChange = (page) => {
    setPagination((p) => ({ ...p, currentPage: page }));
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await updateCandidateStatus(candidateId, newStatus);
      // Refetch current page so the table reflects the real backend state
      // rather than trusting an optimistic local update.
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Failed to update candidate status:", err);
      // consider surfacing this to the user — e.g. a toast
    }
  };

  return (
    <div className="trainer-dashboard">
      <Topbar
        user={{ name: "Trainer Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />
      <div className="trainer-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="trainer-dashboard__main">
          <main className="trainer-dashboard__body">
            <div className={"candidate-management-content"}>
              <div className={"candidate-management-page-header"}>
                <h1 className={"candidate-management-title"}>Candidate List</h1>
                <p className={"candidate-management-subtitle"}>
                  {pagination.totalCandidates} candidates
                </p>
              </div>

              {/* <div className={'candidate-management-stats-grid'}>
                {candidateStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div> */}
              <div className={"candidate-management-stats-grid"}>
                <StatCard
                  icon={UserRound}
                  value={statsLoading ? "—" : (stats?.totalCandidates ?? 0)}
                  label="Total Candidate"
                  tone="orange"
                />
                <StatCard
                  icon={CheckCircle2}
                  value={statsLoading ? "—" : (stats?.activeCandidates ?? 0)}
                  label="Active Candidate"
                  tone="green"
                />
                <StatCard
                  icon={Phone}
                  value={statsLoading ? "—" : (stats?.droppedCandidates ?? 0)}
                  label="Dropped out"
                  tone="blue"
                />
              </div>

              <FilterBar
                batchOptions={batchLabels}
                courseOptions={courseLabels}
                statusOptions={statusOptions}
                onApply={handleApplyFilter}
              />

              <section className={"candidate-management-table-section"}>
                <div className={"candidate-management-table-header"}>
                  <h2 className={"candidate-management-table-title"}>
                    All Candidates
                  </h2>
                </div>

                {loading && <p>Loading candidates…</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && (
                  <>
                    {/* <CandidateTable candidates={candidates} onStatusChange={() => {}} /> */}
                    <CandidateTable
                      candidates={candidates}
                      onStatusChange={handleStatusChange}
                    />
                    <Pagination
                      showing={candidates.length}
                      total={pagination.totalCandidates}
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CandidateManagement;
