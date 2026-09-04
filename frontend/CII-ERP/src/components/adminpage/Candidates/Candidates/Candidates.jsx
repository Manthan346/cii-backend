import React, { useMemo, useState } from 'react';
import { FileDown } from 'lucide-react';
import Button from '../../shared/Button/Button';
import CandidatesOverview from '../CandidatesOverview/CandidatesOverview';
import CandidatesFilterBar from '../CandidatesFilterBar/CandidatesFilterBar';
import CandidatesTable from '../CandidatesTable/CandidatesTable';
import {
  candidateStats,
  candidateCourseOptions,
  candidateCompanyOptions,
  candidateAttendanceOptions,
  candidateCertificateOptions,
  candidatesList,
  candidatesPagination,
} from '../../data';
import './Candidates.css';

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
const attendanceMatchesBucket = (attendance, bucket) => {
  if (bucket === 'all' || attendance == null) return bucket === 'all';
  if (bucket === 'high') return attendance >= 70;
  if (bucket === 'mid') return attendance >= 40 && attendance < 70;
  if (bucket === 'low') return attendance < 40;
  return true;
};

const Candidates = () => {
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('all');
  const [company, setCompany] = useState('all');
  const [attendance, setAttendance] = useState('all');
  const [certificate, setCertificate] = useState('all');
  const [page, setPage] = useState(candidatesPagination.currentPage);
  const [selectedIds, setSelectedIds] = useState([]);

  // Client-side filtering over the mock list, standing in for a real
  // `GET /api/admin/candidates?search=&course=&company=&attendance=&certificates=&page=` call.
  const filteredCandidates = useMemo(() => {
    return candidatesList.filter((candidate) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        candidate.name.toLowerCase().includes(q) ||
        candidate.candidateId.toLowerCase().includes(q);
      const matchesCourse =
        course === 'all' ||
        (candidate.course &&
          candidate.course.toLowerCase().replace(/\s+/g, '-') === course);
      const matchesCompany = company === 'all';
      const matchesAttendance = attendanceMatchesBucket(candidate.attendance, attendance);
      const matchesCertificate =
        certificate === 'all' || candidate.certificate === certificate;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesCompany &&
        matchesAttendance &&
        matchesCertificate
      );
    });
  }, [search, course, company, attendance, certificate]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredCandidates.length
        ? []
        : filteredCandidates.map((c) => c.id)
    );
  };

  const handleAddCandidate = () => {
    // TODO: open an "Add Candidate" modal / navigate to a create form
    console.log('add candidate');
  };

  const handleExport = () => {
    // TODO: GET /api/admin/candidates/export?format=csv (or similar)
    console.log('export candidates');
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
        <div className="admin-candidates__heading-actions">
          <Button icon={FileDown} onClick={handleExport}>
            Export As
          </Button>
        </div>
      </div>

      <CandidatesOverview stats={candidateStats} />

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
        pagination={{ ...candidatesPagination, currentPage: page }}
        onPageChange={setPage}
        onAddCandidate={handleAddCandidate}
        onViewCandidate={(id) => console.log('view', id)}
        onEditCandidate={(id) => console.log('edit', id)}
        onRowMenu={(id) => console.log('menu', id)}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
      />
    </div>
  );
};

export default Candidates;
