import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import Button from '../Button/Button';
import './FilterBar.css';

/**
 * Search + Batches + Courses + Status filters, with an Apply Filter action.
 * onApply receives the current filter state so it can be wired to a backend call.
 */
export default function FilterBar({
  batchOptions = [],
  courseOptions = [],
  statusOptions = [],
  onApply,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [batch, setBatch] = useState(batchOptions[0] || '');
  const [course, setCourse] = useState(courseOptions[0] || '');
  const [status, setStatus] = useState(statusOptions[0] || '');
  const handleApply = () => {
    onApply?.({
      searchTerm,
      batch,
      course,
      status,
    });
  };
  return (
    <div className={'shared-filter-bar-bar'}>
      <div className={'shared-filter-bar-field'}>
        <label className={'shared-filter-bar-label'}>Search</label>
        <div className={'shared-filter-bar-search-input-wrap'}>
          <Search size={16} className={'shared-filter-bar-search-icon'} />
          <input
            type="text"
            placeholder="Search by name,ID or phone"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={'shared-filter-bar-search-input'}
          />
        </div>
      </div>

      <Dropdown
        label="Batches"
        options={batchOptions}
        value={batch}
        onChange={setBatch}
      />
      <Dropdown
        label="Courses"
        options={courseOptions}
        value={course}
        onChange={setCourse}
      />
      <Dropdown
        label="Status"
        options={statusOptions}
        value={status}
        onChange={setStatus}
      />

      <div className={'shared-filter-bar-apply-wrap'}>
        <Button variant="outline" icon={Filter} onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
