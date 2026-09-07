import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./Dropdown.css";

/**
 * Labeled select-style dropdown (Batches / Courses / Status filters).
 *
 * options: string[] | { label: string, value: any }[]
 *   - Existing callers passing string[] keep working unchanged.
 *   - New callers can pass {label, value} objects when the displayed
 *     text needs to differ from the actual submitted value (e.g.
 *     showing course_name while storing course_id).
 * value: the currently selected value (string, or whatever `value`
 *   type was passed in the object form)
 * onChange: (nextValue) => void — receives the raw string for
 *   string[] options, or the `.value` for object options.
 */
function normalizeOption(option) {
  return typeof option === "object" && option !== null
    ? option
    : { label: option, value: option };
}

export default function Dropdown({ label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalized = options.map(normalizeOption);
  const selected = normalized.find((o) => o.value === value);

  return (
    <div className={"shared-dropdown-field"} ref={containerRef}>
      <label className={"shared-dropdown-label"}>{label}</label>
      <button
        type="button"
        className={`${"shared-dropdown-trigger"} ${open ? "shared-dropdown-trigger-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : value}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <ul className={"shared-dropdown-menu"} role="listbox">
          {normalized.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`${"shared-dropdown-option"} ${option.value === value ? "shared-dropdown-option-active" : ""}`}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
