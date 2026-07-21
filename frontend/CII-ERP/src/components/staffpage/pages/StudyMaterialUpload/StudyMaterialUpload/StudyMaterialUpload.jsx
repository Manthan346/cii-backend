import React, { useState } from "react";
import {
  LayoutGrid,
  CheckCircle2,
  MoreHorizontal,
  Coins,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
} from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { Dropdown, Button, Pagination } from "../../../shared";
import StatCard from "../StatCard/StatCard";
import QuickUploadPanel from "../QuickUploadPanel/QuickUploadPanel";
import UploadMaterialModal from "../UploadMaterialModal/UploadMaterialModal";
import MaterialTable from "../MaterialTable/MaterialTable";
import {
  materialStats,
  materialMeta,
  materialRecords as defaultRecords,
  courseOptions,
  materialTypeOptions,
  materialStatusOptions,
} from "../../../data";
import "../../../styles/variables.css";
import "./StudyMaterialUpload.css";
import styles from "./StudyMaterialUpload.module.css";

/**
 * StudyMaterialUpload
 *
 * Staff "Study Material Upload" page. Mounts the shared Topbar +
 * Sidebar shell (identical composition to every other staff page)
 * around the page-specific content: summary stat cards, a Quick
 * Upload drag-and-drop panel, a Search/Course/Type/Status filter bar,
 * the "All Materials" table, and a pagination footer - matches the
 * reference "Study Material Upload" screens.
 *
 * The "+ Add new material" button (and the Quick Upload panel's
 * "Browse Files") both open the same UploadMaterialModal; saving it
 * prepends a new row to the table and shows the success toast.
 */
const STAT_ICONS = {
  grid: LayoutGrid,
  check: CheckCircle2,
  dots: MoreHorizontal,
  coins: Coins,
};

const StudyMaterialUpload = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [course, setCourse] = useState(courseOptions[0]);
  const [type, setType] = useState(materialTypeOptions[0]);
  const [status, setStatus] = useState(materialStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState(defaultRecords);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveMaterial = ({ title, course: materialCourse, fileName }) => {
    const newRecord = {
      id: Date.now(),
      name: title || fileName || "Untitled material",
      course: materialCourse || "—",
      type: (fileName || "").split(".").pop()?.toUpperCase() || "PDF",
      uploadedBy: "Staff Admin",
      date: "Today",
      size: "—",
      status: "Draft",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className={styles.content}>
              {showToast && (
                <div className={styles.toast} role="status">
                  Material uploaded successfully!!
                </div>
              )}

              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.title}>Study Material Upload</h1>
                  <p className={styles.subtitle}>
                    {materialMeta.totalMaterials} materials shared across {materialMeta.totalActiveBatches}{" "}
                    active batches
                  </p>
                </div>
                <Button variant="primary" icon={Plus} iconPosition="left" onClick={() => setShowModal(true)}>
                  Add new material
                </Button>
              </div>

              <div className={styles.statsGrid}>
                {materialStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div>

              <QuickUploadPanel onBrowse={() => setShowModal(true)} />

              <div className={styles.filterBar}>
                <div className={styles.searchField}>
                  <label className={styles.filterLabel}>SEARCH MATERIAL</label>
                  <div className={styles.searchInputWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search by Title or course"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                </div>

                <Dropdown label="COURSE" options={courseOptions} value={course} onChange={setCourse} />
                <Dropdown label="TYPE" options={materialTypeOptions} value={type} onChange={setType} />
                <Dropdown label="STATUS" options={materialStatusOptions} value={status} onChange={setStatus} />

                <div className={styles.applyWrap}>
                  <Button variant="outline" icon={Filter}>
                    Apply Filter
                  </Button>
                </div>
              </div>

              <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.tableTitle}>All Materials</h2>
                  <div className={styles.tableActions}>
                    <button type="button" className={styles.iconBtn} aria-label="Download list">
                      <Download size={16} />
                    </button>
                    <button type="button" className={styles.iconBtn} aria-label="Print list">
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                <MaterialTable records={records} />

                <Pagination
                  showing={records.length}
                  total={materialMeta.totalMaterials}
                  currentPage={currentPage}
                  totalPages={materialMeta.totalPages}
                  onPageChange={setCurrentPage}
                  label={`Showing 1-${records.length} out of ${materialMeta.totalMaterials}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {showModal && (
        <UploadMaterialModal onCancel={() => setShowModal(false)} onSave={handleSaveMaterial} />
      )}
    </div>
  );
};

export default StudyMaterialUpload;
