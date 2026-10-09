import { useState } from 'react';
import { Search } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import './FilterBar.css';

function getOptionValue(option) {
  return typeof option === 'object' && option !== null
    ? option.value
    : option;
}

/**
 * Search + Batches + Courses + Status filters, applied as they change.
 */
export default function FilterBar({
  batchOptions = [],
  courseOptions = [],
  statusOptions = [],
  onFilterChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [batch, setBatch] = useState(getOptionValue(batchOptions[0]) || '');
  const [course, setCourse] = useState(getOptionValue(courseOptions[0]) || '');
  const [status, setStatus] = useState(getOptionValue(statusOptions[0]) || '');
  const updateFilter = (key, value) => {
    const nextFilters = {
      searchTerm,
      batch,
      course,
      status,
      [key]: value,
    };
    if (key === 'searchTerm') setSearchTerm(value);
    if (key === 'batch') setBatch(value);
    if (key === 'course') setCourse(value);
    if (key === 'status') setStatus(value);
    onFilterChange?.(nextFilters);
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
            onChange={(event) => updateFilter('searchTerm', event.target.value)}
            className={'shared-filter-bar-search-input'}
          />
        </div>
      </div>

      <Dropdown
        label="Batches"
        options={batchOptions}
        value={batch}
        onChange={(value) => updateFilter('batch', value)}
      />
      <Dropdown
        label="Courses"
        options={courseOptions}
        value={course}
        onChange={(value) => updateFilter('course', value)}
      />
      <Dropdown
        label="Status"
        options={statusOptions}
        value={status}
        onChange={(value) => updateFilter('status', value)}
      />
    </div>
  );
}
