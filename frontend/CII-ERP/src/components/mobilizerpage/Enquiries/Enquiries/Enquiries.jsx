import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import EnquiriesStats from '../EnquiriesStats/EnquiriesStats';
import EnquiriesFilterBar from '../EnquiriesFilterBar/EnquiriesFilterBar';
import EnquiriesTabs from '../EnquiriesTabs/EnquiriesTabs';
import EnquiriesTable from '../EnquiriesTable/EnquiriesTable';
import AddCandidateModal from '../AddCandidateModal/AddCandidateModal';
import CandidateDetailModal from '../CandidateDetailModal/CandidateDetailModal';
import { candidates as initialCandidates, enquiriesStats } from '../../data/enquiriesData';
import './Enquiries.css';

const PAGE_SIZE = 5;

const TAB_STATUS_MAP = {
  'New Enquiries': null, // no distinct "New" status in the sample data yet
  'Pending Verification': null,
  Verified: 'Verified',
  'Dropped out': 'Dropped Out',
};

export default function Enquiries() {
  const [candidateList, setCandidateList] = useState(initialCandidates);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailCandidateId, setDetailCandidateId] = useState(null);

  // Backend total shown in the header stat card / tab label / footer text —
  // deliberately not `candidateList.length`, same reasoning as elsewhere:
  // the sample list is one page of a much larger real dataset.
  const totalCount = enquiriesStats.find((s) => s.id === 'total')?.value ?? 0;

  const filteredCandidates = useMemo(() => {
    let list = candidateList;

    const requiredStatus = TAB_STATUS_MAP[activeTab];
    if (requiredStatus) {
      list = list.filter((c) => c.status === requiredStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      );
    }

    return list;
  }, [candidateList, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageCandidates = filteredCandidates.slice(pageStart, pageStart + PAGE_SIZE);

  const detailCandidate = candidateList.find((c) => c.id === detailCandidateId) || null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleAddCandidate = (form) => {
    const newCandidate = {
      id: `C-${Date.now()}`,
      firstName: form.firstName || 'New',
      lastName: form.lastName || 'Candidate',
      area: form.location || '—',
      enquirySource: form.interestedIn[0] || 'Training',
      enquiryDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
      contact: form.mobile || '—',
      email: '—',
      education: '—',
      status: 'Not Visited',
      avatarTone: 'navy',
      timeline: [
        {
          event: 'Contact by mobilizer',
          dotTone: 'navy',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          by: 'You',
          location: form.location || '—',
        },
      ],
    };
    setCandidateList((prev) => [newCandidate, ...prev]);
    setAddModalOpen(false);
  };

  const handleAddTimelineEntry = (candidateId, entry) => {
    setCandidateList((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, timeline: [...c.timeline, entry] } : c))
    );
  };

  return (
    <div className="enquiries-page">
      <div className="eq-header">
        <div className="eq-header__text">
          <h1 className="eq-header__title">Enquiries</h1>
          <p className="eq-header__subtitle">Leads received from the landing page, before enrollment begins</p>
        </div>
        <button type="button" className="eq-add-btn" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          Add new Candidate
        </button>
      </div>

      <div className="eq-banner">
        <span className="eq-banner__label">Enquiries</span>
        <span className="eq-banner__text">
          {' '}
          Are candidates you are still calling and qualifying. Once they visit and verify, move them to
          enrollments to complete the enrollment form.
        </span>
      </div>

      <EnquiriesStats />

      <EnquiriesFilterBar onSearch={handleSearch} onExport={() => console.log('Export as...')} />

      <EnquiriesTabs activeTab={activeTab} onChange={handleTabChange} />

      <EnquiriesTable
        candidates={pageCandidates}
        onViewCandidate={(c) => setDetailCandidateId(c.id)}
        pagination={{
          page: safePage,
          totalPages,
          totalCount,
          rangeStart: filteredCandidates.length === 0 ? 0 : pageStart + 1,
          rangeEnd: Math.min(pageStart + PAGE_SIZE, filteredCandidates.length),
          onPrev: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => Math.min(totalPages, p + 1)),
          onPage: (p) => setPage(p),
        }}
      />

      <AddCandidateModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddCandidate}
      />

      <CandidateDetailModal
        candidate={detailCandidate}
        onClose={() => setDetailCandidateId(null)}
        onAddTimelineEntry={handleAddTimelineEntry}
      />
    </div>
  );
}
