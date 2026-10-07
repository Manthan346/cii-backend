import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import {
  Button,
  Dropdown,
  Pagination,
  TRAINER_PAGE_SIZE,
} from "../../../shared";
import { assessmentRecords } from "../../../data/assessmentsData";
import {
  createAssessment,
  fetchAssessments,
  fetchMyBatches,
  mapAssessmentRecord,
} from "../../../../../../api/trainer/assessmentService";
import AssessmentTable from "../AssessmentTable/AssessmentTable";
import CreateAssessment from "../CreateAssessment/CreateAssessment";
import EditAssessment from "../EditAssessment/EditAssessment";
import ViewAssessment from "../ViewAssessment/ViewAssessment";
import "../../../styles/variables.css";
import "./Assessments.css";

export default function Assessments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBatchId, setSearchBatchId] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [batches, setBatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssessments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAssessments({
        page: currentPage,
        limit: TRAINER_PAGE_SIZE,
        search,
        batchId: searchBatchId,
      });
      setRecords((data.assessments ?? []).map(mapAssessmentRecord));
      setTotalRecords(data.totalRecords ?? 0);
      setTotalPages(Math.max(data.totalPages ?? 1, 1));
    } catch (requestError) {
      setRecords(assessmentRecords);
      setError(
        requestError.response?.data?.message ||
          "Unable to load assessments. Showing sample data.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, searchBatchId]);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  useEffect(() => {
    fetchMyBatches()
      .then(setBatches)
      .catch(() => {});
  }, []);

  const visibleRecords = assessmentType
    ? records.filter((record) => record.assessment_type === assessmentType)
    : records;

  const saveAssessment = async (form) => {
    if (modal.mode === "create") {
      await createAssessment({
        batchId: form.batch_id,
        title: form.title.trim(),
        assessmentDesc: form.assessment_desc.trim(),
        assessmentType: form.assessment_type,
        assessmentDate: form.assessment_date,
        questions: Number(form.no_of_questions),
        assessmentDuration: Number(form.assessment_duration),
        assessmentLink: form.assessment_link.trim(),
      });
      setModal(null);
      await loadAssessments();
      return;
    }
    const normalized = {
      ...form,
      no_of_questions: Number(form.no_of_questions),
      assessment_duration: Number(form.assessment_duration),
    };
    if (modal.mode === "edit")
      setRecords((current) =>
        current.map((item) =>
          item.id === modal.assessment.id
            ? { ...normalized, id: item.id }
            : item,
        ),
      );
    else
      setRecords((current) => [...current, { ...normalized, id: Date.now() }]);
    setModal(null);
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications
        onMenuToggle={() => setSidebarOpen((open) => !open)}
      />
      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="assessments-content">
              <header className="assessments-page-header">
                <div>
                  <p className="assessments-eyebrow">Resources</p>
                  <h1>Assessments</h1>
                  <p>Manage assessments shared with your batches.</p>
                </div>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setModal({ mode: "create" })}
                >
                  Create assessment
                </Button>
              </header>
              <div className="assessments-filter-bar">
                <label className="assessments-search-field">
                  <span>Search assessments</span>
                  <div className="assessments-search-input-wrap">
                    <Search size={16} aria-hidden="true" />
                    <input
                      type="search"
                      placeholder="Search by title, batch code, or description"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </label>
                <Dropdown
                  label="Batch Code"
                  options={[
                    { label: "All Batch Codes", value: "" },
                    ...batches.map((batch) => ({
                      label: batch.batch_code,
                      value: batch.batch_id,
                    })),
                  ]}
                  value={searchBatchId}
                  onChange={(value) => {
                    setSearchBatchId(value);
                    setCurrentPage(1);
                  }}
                />
                <Dropdown
                  label="Assessment Type"
                  options={[
                    { label: "All Types", value: "" },
                    { label: "Aptitude", value: "APTITUDE" },
                    { label: "Technical", value: "TECHNICAL" },
                    { label: "Communication", value: "COMMUNICATION" },
                    { label: "Mock interview", value: "MOCK_INTERVIEW" },
                    { label: "Final assessment", value: "FINAL_ASSESSMENT" },
                  ]}
                  value={assessmentType}
                  onChange={(value) => {
                    setAssessmentType(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {error && <p className="assessments-error">{error}</p>}
              {loading ? (
                <p className="assessments-loading">Loading assessments...</p>
              ) : (
                <AssessmentTable
                  records={visibleRecords}
                  onView={(assessment) =>
                    setModal({ mode: "view", assessment })
                  }
                  onEdit={(assessment) =>
                    setModal({ mode: "edit", assessment })
                  }
                />
              )}
              {!loading && (
                <Pagination
                  showing={visibleRecords.length}
                  total={assessmentType ? visibleRecords.length : totalRecords}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={TRAINER_PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  label={`Showing ${visibleRecords.length === 0 ? 0 : (currentPage - 1) * TRAINER_PAGE_SIZE + 1}-${(currentPage - 1) * TRAINER_PAGE_SIZE + visibleRecords.length} out of ${assessmentType ? visibleRecords.length : totalRecords}`}
                />
              )}
            </div>
          </main>
        </div>
      </div>
      {modal?.mode === "create" && (
        <CreateAssessment
          onClose={() => setModal(null)}
          onSubmit={saveAssessment}
        />
      )}
      {modal?.mode === "edit" && (
        <EditAssessment
          assessment={modal.assessment}
          onClose={() => setModal(null)}
          onSubmit={saveAssessment}
        />
      )}
      {modal?.mode === "view" && (
        <ViewAssessment
          assessment={modal.assessment}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
