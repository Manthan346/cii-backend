// src/components/candidatepage/shared/SearchBar/SearchBar.jsx
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

/**
 * Reusable, controlled search input. Used in the Topbar and anywhere
 * else a search field is needed, so it accepts value/onChange rather
 * than owning its own state.
 */
function SearchBar({ placeholder, value, onChange, onSubmit, ariaLabel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <Search size={18} className={styles.icon} aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      />
    </form>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  ariaLabel: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: "Search...",
  onSubmit: undefined,
  ariaLabel: "Search",
};

export default SearchBar;
