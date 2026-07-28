import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Dropdown, Button } from "../../../shared";
import styles from "./EventFilterBar.module.css";

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
export default function EventFilterBar({ typeOptions = [], statusOptions = [], onApply }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState(typeOptions[0] || "");
  const [status, setStatus] = useState(statusOptions[0] || "");

  const handleApply = () => {
    onApply?.({ searchTerm, type, status });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.searchField}>
        <label className={styles.label}>Search</label>
        <div className={styles.searchInputWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by event title or venue"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <Dropdown label="Type" options={typeOptions} value={type} onChange={setType} />
      <Dropdown label="Status" options={statusOptions} value={status} onChange={setStatus} />

      <div className={styles.applyWrap}>
        <Button variant="outline" icon={Filter} onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
