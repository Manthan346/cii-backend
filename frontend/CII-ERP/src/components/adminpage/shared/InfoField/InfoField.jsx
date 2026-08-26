import React from 'react';
import './InfoField.css';

/**
 * InfoField
 *
 * Small gray caption + bold value pair, used throughout Profile's
 * read-only panels (Personal Information, Contact, Education,
 * Experience, Guardian Information) instead of duplicating the same
 * label/value markup in every panel.
 *
 * Props:
 *  - label: string
 *  - value: ReactNode -> usually a string, but can be any node (e.g. a
 *           StatusPill for Priority-style fields)
 */
const InfoField = ({ label, value }) => {
  return (
    <div className="admin-info-field">
      <span className="admin-info-field__label">{label}</span>
      <div className="admin-info-field__value">{value || '—'}</div>
    </div>
  );
};

export default InfoField;
