import { useState, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import {
  Dropdown,
  Button,
  Pagination,
  TRAINER_PAGE_SIZE,
} from "../../../shared";
import UploadMaterialModal from "../UploadMaterialModal/UploadMaterialModal";
import EditMaterialModal from "../EditMaterialModal/EditMaterialModal";
import ViewMaterialModal from "../ViewMaterialModal/ViewMaterialModal";
import MaterialTable from "../MaterialTable/MaterialTable";
import {
  fetchStudyMaterials,
  fetchStudyMaterialFilterOptions,
  mapStudyMaterialRecord,
} from "../../../../../../api/trainer/studyMaterialService";
import "../../../styles/variables.css";
import "./StudyMaterialUpload.css";

const StudyMaterialUpload = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchOptions, setBatchOptions] = useState([
    { label: "All Batches", value: "" },
  ]);
  const [statusOptions, setStatusOptions] = useState([
    { label: "All Status", value: "" },
  ]);
  const [batch, setBatch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [viewMaterial, setViewMaterial] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchStudyMaterialFilterOptions()
      .then(({ batches, statuses }) => {
        setBatchOptions(batches);
        setStatusOptions(statuses);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            "Failed to load study material filter options",
        );
      });
  }, []);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudyMaterials({
        page: currentPage,
        limit: TRAINER_PAGE_SIZE,
        search: searchTerm,
        batchId: batch,
        status,
      });
      setRecords(data.studyMaterials.map(mapStudyMaterialRecord));
      setTotalRecords(data.totalRecords);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load study materials");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, batch, status]);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => loadMaterials(),
      searchTerm.trim() ? 300 : 0,
    );
    return () => clearTimeout(timeoutId);
  }, [loadMaterials]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSaveMaterial = () => {
    // The modal now performs the real API call itself and only calls
    // onSave on success — this just closes the modal and refreshes
    // the list from the server.
    setShowModal(false);
    setShowToast(true);
    loadMaterials();
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleEditMaterial = () => {
    setShowToast(true);
    loadMaterials();
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className={"study-material-upload-content"}>
              {showToast && (
                <div className={"study-material-upload-toast"} role="status">
                  Material uploaded successfully!!
                </div>
              )}

              <div className={"study-material-upload-page-header"}>
                <div>
                  <h1 className={"study-material-upload-title"}>
                    Study Material Upload
                  </h1>
                  <p className={"study-material-upload-subtitle"}>
                    Manage shared study materials
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={Plus}
                  iconPosition="left"
                  onClick={() => setShowModal(true)}
                >
                  Add new Material
                </Button>
              </div>

              <div className={"study-material-upload-filter-bar"}>
                <div className={"study-material-upload-search-field"}>
                  <label className={"study-material-upload-filter-label"}>
                    SEARCH MATERIAL
                  </label>
                  <div className={"study-material-upload-search-input-wrap"}>
                    <Search
                      size={16}
                      className={"study-material-upload-search-icon"}
                    />
                    <input
                      type="text"
                      placeholder="Search by Title or course"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className={"study-material-upload-search-input"}
                    />
                  </div>
                </div>

                <Dropdown
                  label="BATCH"
                  options={batchOptions}
                  value={batch}
                  onChange={(value) => {
                    setBatch(value);
                    setCurrentPage(1);
                  }}
                />
                <Dropdown
                  label="STATUS"
                  options={statusOptions}
                  value={status}
                  onChange={(value) => {
                    setStatus(value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <section className={"study-material-upload-table-section"}>
                <div className={"study-material-upload-table-header"}>
                  <h2 className={"study-material-upload-table-title"}>
                    All Materials
                  </h2>
                </div>

                {error && (
                  <p className="study-material-upload-error">{error}</p>
                )}
                {loading ? (
                  <p>Loading materials...</p>
                ) : (
                  <MaterialTable
                    records={records}
                    onView={setViewMaterial}
                    onEdit={setSelectedMaterial}
                  />
                )}

                <Pagination
                  showing={records.length}
                  total={totalRecords}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={TRAINER_PAGE_SIZE}
                  label={`Showing ${
                    records.length ? (currentPage - 1) * TRAINER_PAGE_SIZE + 1 : 0
                  }-${
                    (currentPage - 1) * TRAINER_PAGE_SIZE + records.length
                  } out of ${totalRecords}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {showModal && (
        <UploadMaterialModal
          onCancel={() => setShowModal(false)}
          onSave={handleSaveMaterial}
        />
      )}

      {selectedMaterial && (
        <EditMaterialModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          onSave={handleEditMaterial}
        />
      )}

      {viewMaterial && (
        <ViewMaterialModal
          material={viewMaterial}
          onClose={() => setViewMaterial(null)}
        />
      )}
    </div>
  );
};

export default StudyMaterialUpload;
