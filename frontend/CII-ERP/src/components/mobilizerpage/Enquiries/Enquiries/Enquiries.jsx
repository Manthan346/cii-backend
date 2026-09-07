import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import EnquiriesStats from "../EnquiriesStats/EnquiriesStats";
import EnquiriesFilterBar from "../EnquiriesFilterBar/EnquiriesFilterBar";
import EnquiriesTabs from "../EnquiriesTabs/EnquiriesTabs";
import EnquiriesTable from "../EnquiriesTable/EnquiriesTable";
import AddCandidateModal from "../AddCandidateModal/AddCandidateModal";
import CandidateDetailModal from "../CandidateDetailModal/CandidateDetailModal";
import {
  changeEnquiryStatus,
  fetchEnquiries,
  fetchEnquiryDetails,
} from "../../../../../api/mobilizer/enquiryService";
import "./Enquiries.css";

const PAGE_SIZE = 20;

const TAB_STATUS_MAP = {
  "Follow Up Pending": "FOLLOW_UP_PENDING",
  "Call Received": "CALL_RECIEVED",
  "Center Visited": "CENTER_VISITED",
  "Not Connected": "NOT_CONNECTED",
};

export default function Enquiries() {
  const [candidateList, setCandidateList] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailCandidateId, setDetailCandidateId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    fetchEnquiries({
      page,
      limit: PAGE_SIZE,
      search: searchQuery.trim() || undefined,
      status: statusFilter || TAB_STATUS_MAP[activeTab] || undefined,
      source: sourceFilter || undefined,
      date: dateFilter || undefined,
    })
      .then(({ enquiries, pagination }) => {
        if (!isMounted) return;
        setCandidateList(enquiries);
        setTotalCount(pagination.totalEnquiries);
        setTotalPages(Math.max(1, pagination.totalPages));
      })
      .catch(() => {
        if (isMounted) setError("Unable to load enquiries");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, dateFilter, page, searchQuery, sourceFilter, statusFilter]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatusFilter("");
    setPage(1);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleViewCandidate = (candidate) => {
    setDetailCandidateId(candidate.id);
    setDetailLoading(true);
    fetchEnquiryDetails(candidate.id)
      .then(setDetailCandidate)
      .catch(() => setError("Unable to load enquiry details"))
      .finally(() => setDetailLoading(false));
  };

  const handleStatusChange = async (candidateId, option) => {
    await changeEnquiryStatus(candidateId, option.status);
    const refreshedCandidate = await fetchEnquiryDetails(candidateId);
    setDetailCandidate(refreshedCandidate);
    setCandidateList((currentCandidates) =>
      currentCandidates.map((currentCandidate) =>
        currentCandidate.id === candidateId
          ? { ...currentCandidate, status: refreshedCandidate.status }
          : currentCandidate,
      ),
    );
  };

  return (
    <div className="enquiries-page">
      <div className="eq-header">
        <div className="eq-header__text">
          <h1 className="eq-header__title">Enquiries</h1>
          <p className="eq-header__subtitle">
            Leads received from the landing page, before enrollment begins
          </p>
        </div>
        <button
          type="button"
          className="eq-add-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={16} />
          Add new Candidate
        </button>
      </div>

      <div className="eq-banner">
        <span className="eq-banner__label">Enquiries</span>
        <span className="eq-banner__text">
          {" "}
          Are candidates you are still calling and qualifying. Once they visit
          and verify, move them to enrollments to complete the enrollment form.
        </span>
      </div>

      <EnquiriesStats />

      <EnquiriesFilterBar
        onSearch={handleSearch}
        onStatusChange={(status) => {
          setStatusFilter(status === "all" ? "" : status);
          setPage(1);
        }}
        onSourceChange={(source) => {
          setSourceFilter(source === "all" ? "" : source);
          setPage(1);
        }}
        onDateChange={(date) => {
          setDateFilter(date);
          setPage(1);
        }}
        onExport={() => console.log("Export as...")}
      />

      <EnquiriesTabs
        activeTab={activeTab}
        total={totalCount}
        onChange={handleTabChange}
      />

      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading enquiries...</p>
      ) : (
        <EnquiriesTable
          candidates={candidateList}
          onViewCandidate={handleViewCandidate}
          pagination={{
            page,
            totalPages,
            totalCount,
            rangeStart:
              candidateList.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1,
            rangeEnd: Math.min(
              (page - 1) * PAGE_SIZE + candidateList.length,
              totalCount,
            ),
            onPrev: () =>
              setPage((currentPage) => Math.max(1, currentPage - 1)),
            onNext: () =>
              setPage((currentPage) => Math.min(totalPages, currentPage + 1)),
            onPage: setPage,
          }}
        />
      )}

      <AddCandidateModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={() => setAddModalOpen(false)}
      />

      <CandidateDetailModal
        candidate={detailCandidateId && !detailLoading ? detailCandidate : null}
        onClose={() => {
          setDetailCandidateId(null);
          setDetailCandidate(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
