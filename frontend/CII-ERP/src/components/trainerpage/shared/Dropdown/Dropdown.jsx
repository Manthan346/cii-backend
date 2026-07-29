import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

/**
 * Labeled select-style dropdown (Batches / Courses / Status filters).
 * options: string[]
 * value: string (currently selected option)
 * onChange: (nextValue: string) => void
 */
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className={'field'} ref={containerRef}>
      <label className={'label'}>{label}</label>
      <button
        type="button"
        className={`${'trigger'} ${open ? 'triggerOpen' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <ul className={'menu'} role="listbox">
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={`${'option'} ${option === value ? 'optionActive' : ''}`}
              onClick={() => {
                onChange?.(option);
                setOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
