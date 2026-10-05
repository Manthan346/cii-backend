import { useState } from 'react';
import { Search } from 'lucide-react';
import { Dropdown } from '../../../shared';
import './EventFilterBar.css';

/**
 * EventFilterBar (Events)
 *
 * Search + Type + Status filter row for the "All Events" table.
 * Field set (Search by title/venue, Type, Status) is specific to the
 * Events page, so it lives here rather than in /shared - it reuses the
 * generic Dropdown/Button atoms from /shared, same convention as the
 * inline filter bar on the Resources page.
 *
 * Filter changes are passed to the parent immediately.
 */
export default function EventFilterBar({
  typeOptions = [],
  statusOptions = [],
  onFilterChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState(typeOptions[0] || '');
  const [status, setStatus] = useState(statusOptions[0] || '');
  const updateFilter = (key, value) => {
    const nextFilters = {
      searchTerm,
      type,
      status,
      [key]: value,
    };
    if (key === 'searchTerm') setSearchTerm(value);
    if (key === 'type') setType(value);
    if (key === 'status') setStatus(value);
    onFilterChange?.(nextFilters);
  };
  return (
    <div className={'events-event-filter-bar-bar'}>
      <div className={'events-event-filter-bar-search-field'}>
        <label className={'events-event-filter-bar-label'}>Search</label>
        <div className={'events-event-filter-bar-search-input-wrap'}>
          <Search size={16} className={'events-event-filter-bar-search-icon'} />
          <input
            type="text"
            placeholder="Search by event title or venue"
            value={searchTerm}
            onChange={(event) => updateFilter('searchTerm', event.target.value)}
            className={'events-event-filter-bar-search-input'}
          />
        </div>
      </div>

      <Dropdown
        label="Type"
        options={typeOptions}
        value={type}
        onChange={(value) => updateFilter('type', value)}
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
