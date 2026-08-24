import React from 'react';
import './FormField.css';

/**
 * FormField
 *
 * Labeled text input or textarea, styled consistently for form
 * dialogs - built for the Add New Event modal's fields, reusable for
 * any future mobilizer form. Mobilizer's own copy of the pattern used
 * in adminpage/shared.
 *
 * Props:
 *  - label: string
 *  - name: string                -> used as the input's id/name and htmlFor target
 *  - value: string
 *  - onChange: function(value)
 *  - type: 'text' | 'textarea'   -> Defaults to 'text'.
 *  - placeholder: string
 *  - rows: number                -> textarea only. Defaults to 3.
 */
const FormField = ({
  label,
  name,
  value = '',
  onChange,
  type = 'text',
  placeholder,
  rows = 3,
}) => {
  return (
    <label className="mobilizer-form-field" htmlFor={name}>
      {label && <span className="mobilizer-form-field__label">{label}</span>}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className="mobilizer-form-field__textarea"
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
          className="mobilizer-form-field__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </label>
  );
};

export default FormField;
