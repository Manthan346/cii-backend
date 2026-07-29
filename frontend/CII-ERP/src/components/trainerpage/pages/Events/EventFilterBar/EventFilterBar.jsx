import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Dropdown, Button } from '../../../shared';
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
 * onApply receives the current filter state so it can be wired to a
 * backend call later, e.g. GET /api/events?search=&type=&status=
 */
export default function EventFilterBar({
  typeOptions = [],
  statusOptions = [],
  onApply,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState(typeOptions[0] || '');
  const [status, setStatus] = useState(statusOptions[0] || '');
  const handleApply = () => {
    onApply?.({
      searchTerm,
      type,
      status,
    });
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
            onChange={(event) => setSearchTerm(event.target.value)}
            className={'events-event-filter-bar-search-input'}
          />
        </div>
      </div>

      <Dropdown
        label="Type"
        options={typeOptions}
        value={type}
        onChange={setType}
      />
      <Dropdown
        label="Status"
        options={statusOptions}
        value={status}
        onChange={setStatus}
      />

      <div className={'events-event-filter-bar-apply-wrap'}>
        <Button variant="outline" icon={Filter} onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
