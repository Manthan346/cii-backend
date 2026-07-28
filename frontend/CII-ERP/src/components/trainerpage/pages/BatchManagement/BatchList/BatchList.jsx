import { useState } from "react";
import { Layers, CheckCircle2, GraduationCap, Repeat, Search, Filter, Download, Printer } from "lucide-react";
import { Dropdown, Button, Pagination } from "../../../shared";
import StatCard from "./StatCard/StatCard";
import BatchTable from "./BatchTable/BatchTable";
import {
  batches as defaultBatches,
  batchListMeta,
  batchStats,
  trainerFilterOptions,
  batchCourseOptions,
  batchStatusOptions,
} from "../../../data";
import styles from "./BatchList.module.css";

/**
 * BatchList
 *
 * Trainer "Batch List" view (default screen of Batch Management). Shows
 * the four summary stat cards, a search/filter bar (Trainers / Courses
 * / Status), and the "All Batches" table with pagination - matches the
 * reference "Batch List" screen.
 *
 * Props:
 *  - batches: array           -> optional, lifted from the parent so a
 *    newly created batch shows up here. Falls back to the bundled
 *    dummy data (data/batches.js) when not provided.
 *  - onCreateBatch: function  -> switches the parent BatchManagement
 *    page over to the "Create new Batch" view.
 */
const STAT_ICONS = {
  layers: Layers,
  check: CheckCircle2,
  completed: GraduationCap,
  repeat: Repeat,
};

const TOTAL_PAGES = 3;

const BatchList = ({ batches = defaultBatches, onCreateBatch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trainer, setTrainer] = useState(trainerFilterOptions[0]);
  const [course, setCourse] = useState(batchCourseOptions[0]);
  const [status, setStatus] = useState(batchStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Batch List</h1>
          <p className={styles.subtitle}>
            {batchListMeta.totalBatches} batches eunning across {batchListMeta.totalCourses} courses
          </p>
        </div>
        <Button variant="primary" onClick={onCreateBatch}>
          + Create batch
        </Button>
      </div>

      <div className={styles.statsGrid}>
        {batchStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={STAT_ICONS[stat.icon]}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchField}>
          <label className={styles.filterLabel}>SEARCH</label>
          <div className={styles.searchInputWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by batch name & code"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <Dropdown label="TRAINERS" options={trainerFilterOptions} value={trainer} onChange={setTrainer} />
        <Dropdown label="COURSES" options={batchCourseOptions} value={course} onChange={setCourse} />
        <Dropdown label="STATUS" options={batchStatusOptions} value={status} onChange={setStatus} />

        <div className={styles.applyWrap}>
          <Button variant="outline" icon={Filter}>
            Apply Filter
          </Button>
        </div>
      </div>

      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>All Batches</h2>
          <div className={styles.tableActions}>
            <button type="button" className={styles.iconBtn} aria-label="Download list">
              <Download size={16} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Print list">
              <Printer size={16} />
            </button>
          </div>
        </div>

        <BatchTable batches={batches} />

        <Pagination
          showing={batches.length}
          total={batchListMeta.totalBatches}
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
};

export default BatchList;
