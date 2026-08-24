import React from 'react';
import './FormField.css';

/**
 * FormField
 *
 * Labeled text input or textarea, styled consistently for form
 * dialogs - built for EditProfileModal's ~25 fields across its 5
 * tabs, reusable for any future admin form (Add user, Add Candidate,
 * Add Course, ...).
 *
 * Props:
 *  - label: string
 *  - name: string                -> used as the input's id/name and htmlFor target
 *  - value: string
 *  - onChange: function(value)   -> called with the new string value
 *  - type: 'text' | 'textarea'   -> Defaults to 'text'.
 *  - placeholder: string
 *  - rows: number                -> textarea only. Defaults to 3.
 *  - suffix: ReactNode           -> optional element docked inside the input's
 *            right edge (e.g. the send-email icon button on the Email field)
 */
const FormField = ({
  label,
  name,
  value = '',
  onChange,
  type = 'text',
  placeholder,
  rows = 3,
  suffix,
}) => {
  return (
    <label className="admin-form-field" htmlFor={name}>
      {label && <span className="admin-form-field__label">{label}</span>}
      <span className="admin-form-field__control">
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            className="admin-form-field__textarea"
            placeholder={placeholder}
            value={value}
            rows={rows}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <input
            id={name}
            name={name}
            type="text"
            className="admin-form-field__input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
        {suffix && <span className="admin-form-field__suffix">{suffix}</span>}
      </span>
    </label>
  );
};

export default FormField;
