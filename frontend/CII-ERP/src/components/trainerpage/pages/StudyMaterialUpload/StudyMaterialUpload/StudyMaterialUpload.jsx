import React, { useState } from 'react';
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
} from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import { Dropdown, Button, Pagination } from '../../../shared';
import StatCard from '../StatCard/StatCard';
import QuickUploadPanel from '../QuickUploadPanel/QuickUploadPanel';
import UploadMaterialModal from '../UploadMaterialModal/UploadMaterialModal';
import MaterialTable from '../MaterialTable/MaterialTable';
import {
  materialStats,
  materialMeta,
  materialRecords as defaultRecords,
  courseOptions,
  materialTypeOptions,
  materialStatusOptions,
} from '../../../data';
import '../../../styles/variables.css';
import './StudyMaterialUpload.css';
import './StudyMaterialUpload.css';

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
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
      name: title || fileName || 'Untitled material',
      course: materialCourse || '—',
      type: (fileName || '').split('.').pop()?.toUpperCase() || 'PDF',
      uploadedBy: 'Staff Admin',
      date: 'Today',
      size: '—',
      status: 'Draft',
    };
    setRecords((prev) => [newRecord, ...prev]);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };
  return (
    <div className="staff-dashboard">
      <Topbar
        user={{
          name: 'Staff Admin',
        }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className={'study-material-upload-content'}>
              {showToast && (
                <div className={'study-material-upload-toast'} role="status">
                  Material uploaded successfully!!
                </div>
              )}

              <div className={'study-material-upload-page-header'}>
                <div>
                  <h1 className={'study-material-upload-title'}>
                    Study Material Upload
                  </h1>
                  <p className={'study-material-upload-subtitle'}>
                    {materialMeta.totalMaterials} materials shared across{' '}
                    {materialMeta.totalActiveBatches} active batches
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={Plus}
                  iconPosition="left"
                  onClick={() => setShowModal(true)}
                >
                  Add new material
                </Button>
              </div>

              <div className={'study-material-upload-stats-grid'}>
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

              <div className={'study-material-upload-filter-bar'}>
                <div className={'study-material-upload-search-field'}>
                  <label className={'study-material-upload-filter-label'}>
                    SEARCH MATERIAL
                  </label>
                  <div className={'study-material-upload-search-input-wrap'}>
                    <Search
                      size={16}
                      className={'study-material-upload-search-icon'}
                    />
                    <input
                      type="text"
                      placeholder="Search by Title or course"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className={'study-material-upload-search-input'}
                    />
                  </div>
                </div>

                <Dropdown
                  label="COURSE"
                  options={courseOptions}
                  value={course}
                  onChange={setCourse}
                />
                <Dropdown
                  label="TYPE"
                  options={materialTypeOptions}
                  value={type}
                  onChange={setType}
                />
                <Dropdown
                  label="STATUS"
                  options={materialStatusOptions}
                  value={status}
                  onChange={setStatus}
                />

                <div className={'study-material-upload-apply-wrap'}>
                  <Button variant="outline" icon={Filter}>
                    Apply Filter
                  </Button>
                </div>
              </div>

              <section className={'study-material-upload-table-section'}>
                <div className={'study-material-upload-table-header'}>
                  <h2 className={'study-material-upload-table-title'}>
                    All Materials
                  </h2>
                  <div className={'study-material-upload-table-actions'}>
                    <button
                      type="button"
                      className={'study-material-upload-icon-btn'}
                      aria-label="Download list"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      className={'study-material-upload-icon-btn'}
                      aria-label="Print list"
                    >
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
        <UploadMaterialModal
          onCancel={() => setShowModal(false)}
          onSave={handleSaveMaterial}
        />
      )}
    </div>
  );
};
export default StudyMaterialUpload;
