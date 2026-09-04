import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardX, UserCheck, Users } from "lucide-react";
import CandidatesOverview from "../CandidatesOverview/CandidatesOverview";
import CandidatesFilterBar from "../CandidatesFilterBar/CandidatesFilterBar";
import CandidatesTable from "../CandidatesTable/CandidatesTable";
import {
  candidateCourseOptions,
  candidateCompanyOptions,
  candidateAttendanceOptions,
  candidateCertificateOptions,
  candidatesPagination,
} from "../../data";
import {
  fetchAdminCandidateEnrollments,
  fetchAdminCandidateStats,
  uploadAdminCandidateCertificate,
} from "../../../../../api/admin/candidateService";
import "./Candidates.css";

/**
 * Candidates (Admin)
 *
 * "Manage all candidates across all centers" page: KPI row, live
 * search/course/company/attendance/certificate filters, and the
 * paginated candidate list with row actions.
 *
 * All content currently comes from data/candidatesData.js mocks, and
 * filter/pagination/selection state is held locally here just to make
 * the UI interactive. Swap in a real data-fetching hook (e.g.
 * useCandidates({ search, course, company, attendance, certificate, page }))
 * once the backend endpoints noted in candidatesData.js are ready -
 * the section components don't need to change, they just take the
 * same props.
 */
const normalizeEnrollment = (enrollment) => {
  const candidate = enrollment.candidate ?? {};
  const course = enrollment.course ?? {};
  const batch = enrollment.batch ?? {};
  const certificateStatus = String(
    enrollment.certificate_status ?? "",
  ).toLowerCase();

  return {
    id: enrollment.enrollment_id,
    candidateUuid: candidate.candidate_id,
    candidateId: candidate.candidate_unique_id ?? candidate.candidate_id,
    name:
      candidate.full_name ||
      [candidate.first_name, candidate.last_name].filter(Boolean).join(" ") ||
      "Unknown Candidate",
    course: course.course_name,
    batch: batch.batch_name || batch.batch_code,
    attendance: enrollment.attendance_percentage,
    certificate: certificateStatus === "issued" ? "issued" : "not-issued",
  };
};

const MAX_CERTIFICATE_SIZE = 5 * 1024 * 1024;

const Candidates = () => {
  const [candidateStats, setCandidateStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const [company, setCompany] = useState("all");
  const [attendance, setAttendance] = useState("all");
  const [certificate, setCertificate] = useState("all");
  const [page, setPage] = useState(candidatesPagination.currentPage);
  const [selectedIds, setSelectedIds] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [candidatePagination, setCandidatePagination] = useState({
    ...candidatesPagination,
    totalResults: 0,
  });
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchAdminCandidateStats()
      .then((summary) => {
        if (cancelled) return;

        setCandidateStats([
          {
            id: "total-candidates",
            label: "Total Candidates",
            value: summary.total_candidates ?? 0,
            icon: Users,
            iconBg: "#5B7CFA",
          },
          {
            id: "total-enrollments",
            label: "Total Enrollments",
            value: summary.total_enrollments ?? 0,
            icon: UserCheck,
            iconBg: "#34D399",
          },
          {
            id: "certificates-issued",
            label: "Certificates Issued",
            value: summary.certificates_issued ?? 0,
            icon: CheckCircle2,
            iconBg: "#60A5FA",
          },
          {
            id: "enrolled-this-month",
            label: "Enrolled This Month",
            value: summary.enrollments_this_month ?? 0,
            icon: ClipboardX,
            iconBg: "#F87171",
          },
        ]);
      })
      .catch(() => {
        if (!cancelled) setStatsError("Unable to load candidate stats.");
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    setCandidatesLoading(true);
    setCandidatesError("");

    fetchAdminCandidateEnrollments({
      page,
      limit: 10,
      search,
      attendance,
    })
      .then((response) => {
        if (cancelled) return;

        const responsePagination = response.pagination ?? {};
        setCandidates((response.enrollments ?? []).map(normalizeEnrollment));
        setCandidatePagination({
          currentPage: Number(responsePagination.page ?? page),
          totalPages: Number(responsePagination.totalPages ?? 1),
          pageSize: Number(responsePagination.limit ?? 10),
          totalResults: Number(responsePagination.total ?? 0),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setCandidatesError("Unable to load candidates.");
          setCandidates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setCandidatesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, attendance]);

  const handleUploadCertificate = async (candidate, file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setCandidatesError("Please select a PDF certificate file.");
      return;
    }

    if (file.size > MAX_CERTIFICATE_SIZE) {
      setCandidatesError("Certificate file size must not exceed 5 MB.");
      return;
    }

    try {
      setCandidatesError("");
      await uploadAdminCandidateCertificate(
        candidate.candidateUuid,
        candidate.id,
        file,
      );
      const response = await fetchAdminCandidateEnrollments({
        page,
        limit: 10,
        search,
        attendance,
      });
      const responsePagination = response.pagination ?? {};
      setCandidates((response.enrollments ?? []).map(normalizeEnrollment));
      setCandidatePagination({
        currentPage: Number(responsePagination.page ?? page),
        totalPages: Number(responsePagination.totalPages ?? 1),
        pageSize: Number(responsePagination.limit ?? 10),
        totalResults: Number(responsePagination.total ?? 0),
      });
    } catch (error) {
      setCandidatesError(
        error?.response?.data?.message || "Unable to upload the certificate.",
      );
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesCourse =
        course === "all" ||
        (candidate.course &&
          candidate.course.toLowerCase().replace(/\s+/g, "-") === course);
      const matchesCompany = company === "all";
      const matchesCertificate =
        certificate === "all" || candidate.certificate === certificate;

      return matchesCourse && matchesCompany && matchesCertificate;
    });
  }, [candidates, course, company, certificate]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredCandidates.length
        ? []
        : filteredCandidates.map((c) => c.id),
    );
  };

  return (
    <div className="admin-candidates">
      <div className="admin-candidates__heading">
        <div>
          <h1 className="admin-candidates__title">Total Candidates</h1>
          <p className="admin-candidates__subtitle">
            Manage all candidates across all centers
          </p>
        </div>
      </div>

      {statsError && (
        <div className="admin-candidates__error">{statsError}</div>
      )}
      {statsLoading ? (
        <div className="admin-candidates__loading">
          Loading candidate stats...
        </div>
      ) : (
        <CandidatesOverview stats={candidateStats} />
      )}

      {candidatesError && (
        <div className="admin-candidates__error">{candidatesError}</div>
      )}

      <CandidatesFilterBar
        search={search}
        onSearchChange={setSearch}
        course={course}
        onCourseChange={setCourse}
        company={company}
        onCompanyChange={setCompany}
        attendance={attendance}
        onAttendanceChange={setAttendance}
        certificate={certificate}
        onCertificateChange={setCertificate}
        courseOptions={candidateCourseOptions}
        companyOptions={candidateCompanyOptions}
        attendanceOptions={candidateAttendanceOptions}
        certificateOptions={candidateCertificateOptions}
      />

      <CandidatesTable
        candidates={filteredCandidates}
        pagination={{ ...candidatePagination, currentPage: page }}
        onPageChange={setPage}
        onUploadCertificate={handleUploadCertificate}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
      />

      {candidatesLoading && (
        <div className="admin-candidates__loading">Loading candidates...</div>
      )}
    </div>
  );
};

export default Candidates;
