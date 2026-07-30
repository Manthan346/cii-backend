import { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  GraduationCap,
  Repeat,
  Search,
  Filter,
  Download,
  Printer,
} from 'lucide-react';
import { Dropdown, Button, Pagination } from '../../../shared';
import StatCard from '../StatCard/StatCard';
import BatchTable from '../BatchTable/BatchTable';
import {
  batches as defaultBatches,
  batchListMeta,
  batchStats,
  trainerFilterOptions,
  batchCourseOptions,
  batchStatusOptions,
} from '../../../data';
import './BatchList.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [trainer, setTrainer] = useState(trainerFilterOptions[0]);
  const [course, setCourse] = useState(batchCourseOptions[0]);
  const [status, setStatus] = useState(batchStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className={'batch-management-batch-list-content'}>
      <div className={'batch-management-batch-list-page-header'}>
        <div>
          <h1 className={'batch-management-batch-list-title'}>Batch List</h1>
          <p className={'batch-management-batch-list-subtitle'}>
            {batchListMeta.totalBatches} batches eunning across{' '}
            {batchListMeta.totalCourses} courses
          </p>
        </div>
        <Button variant="primary" onClick={onCreateBatch}>
          + Create batch
        </Button>
      </div>

      <div className={'batch-management-batch-list-stats-grid'}>
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

      <div className={'batch-management-batch-list-filter-bar'}>
        <div className={'batch-management-batch-list-search-field'}>
          <label className={'batch-management-batch-list-filter-label'}>
            SEARCH
          </label>
          <div className={'batch-management-batch-list-search-input-wrap'}>
            <Search
              size={16}
              className={'batch-management-batch-list-search-icon'}
            />
            <input
              type="text"
              placeholder="Search by batch name & code"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={'batch-management-batch-list-search-input'}
            />
          </div>
        </div>

        <Dropdown
          label="TRAINERS"
          options={trainerFilterOptions}
          value={trainer}
          onChange={setTrainer}
        />
        <Dropdown
          label="COURSES"
          options={batchCourseOptions}
          value={course}
          onChange={setCourse}
        />
        <Dropdown
          label="STATUS"
          options={batchStatusOptions}
          value={status}
          onChange={setStatus}
        />

        <div className={'batch-management-batch-list-apply-wrap'}>
          <Button variant="outline" icon={Filter}>
            Apply Filter
          </Button>
        </div>
      </div>

      <section className={'batch-management-batch-list-table-section'}>
        <div className={'batch-management-batch-list-table-header'}>
          <h2 className={'batch-management-batch-list-table-title'}>
            All Batches
          </h2>
          <div className={'batch-management-batch-list-table-actions'}>
            <button
              type="button"
              className={'batch-management-batch-list-icon-btn'}
              aria-label="Download list"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              className={'batch-management-batch-list-icon-btn'}
              aria-label="Print list"
            >
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
