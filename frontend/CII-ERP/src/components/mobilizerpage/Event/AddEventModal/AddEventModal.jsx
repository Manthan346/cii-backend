import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import { eventTypeOptions } from '../../data/eventData';
import './AddEventModal.css';

const EMPTY_FORM = {
  eventType: '',
  eventName: '',
  duration: 'one-day',
  date: '',
  companyName: '',
  course: '',
  description: '',
};

/**
 * AddEventModal
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSubmit: (formValues) => void
 */
export default function AddEventModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleCreate = () => {
    onSubmit?.(form);
    setForm(EMPTY_FORM);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width={520}>
      <div className="ae-modal">
        <button type="button" className="ae-modal__close" onClick={handleClose} aria-label="Close">
          <X size={16} />
        </button>

        <label className="ae-field">
          <span className="ae-field__label">Event type</span>
          <span className="ae-select-wrap">
            <select value={form.eventType} onChange={updateField('eventType')}>
              <option value="" disabled>
                Select Event type
              </option>
              {eventTypeOptions
                .filter((opt) => opt.value !== 'all')
                .map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
            <ChevronDown size={14} className="ae-select__chevron" />
          </span>
        </label>

        <label className="ae-field">
          <span className="ae-field__label">Event Name</span>
          <input type="text" value={form.eventName} onChange={updateField('eventName')} />
        </label>

        <div className="ae-field">
          <span className="ae-field__label">Duration</span>
          <div className="ae-radio-row">
            <label className="ae-radio">
              <input
                type="radio"
                name="duration"
                value="one-day"
                checked={form.duration === 'one-day'}
                onChange={updateField('duration')}
              />
              one day
            </label>
            <label className="ae-radio">
              <input
                type="radio"
                name="duration"
                value="multiple-days"
                checked={form.duration === 'multiple-days'}
                onChange={updateField('duration')}
              />
              Multiple Days
            </label>
          </div>
        </div>

        <label className="ae-field">
          <span className="ae-field__label">Date</span>
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={form.date}
            onChange={updateField('date')}
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => !e.target.value && (e.target.type = 'text')}
          />
        </label>

        <div className="ae-modal__grid">
          <label className="ae-field">
            <span className="ae-field__label">Company Name</span>
            <input type="text" value={form.companyName} onChange={updateField('companyName')} />
          </label>
          <label className="ae-field">
            <span className="ae-field__label">Course</span>
            <input type="text" value={form.course} onChange={updateField('course')} />
          </label>
        </div>

        <label className="ae-field">
          <span className="ae-field__label">Description</span>
          <input type="text" value={form.description} onChange={updateField('description')} />
        </label>

        <div className="ae-modal__actions">
          <button type="button" className="ae-create-btn" onClick={handleCreate}>
            Create Event
          </button>
        </div>
      </div>
    </Modal>
  );
}
