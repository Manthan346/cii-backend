import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import './AddEventModal.css';

const EVENT_TYPES = ['Job Drive', 'Job Fair'];

const INITIAL_FORM = {
  type: '',
  name: '',
  date: '',
  time: '',
  venue: '',
  address: '',
  mapsLink: '',
  description: '',
};

/**
 * AddEventModal
 *
 * Opened by the "+ Add Events" button on Placement Management's list
 * page. Wrapped in the shared Modal - this component only owns the
 * form itself. On submit, builds an event object and hands it back
 * via onSubmit; JobFairJobDrive.jsx decides what happens to it.
 */
const AddEventModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTypeSelect = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({
      name: form.name,
      type: form.type || 'Job Fair',
      date: form.date,
      time: form.time,
      venue: form.venue,
      address: form.address,
      mapsLink: form.mapsLink,
      description: form.description,
      candidates: 0,
      candidatesRegistered: '0',
      status: 'Draft',
      postedDate: new Date().toISOString().slice(0, 10),
    });
    setForm(INITIAL_FORM);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={760}>
      <h2 className="add-event-modal__title">Add Event</h2>

      <div className="add-event-modal__field add-event-modal__field--select">
        <span className="add-event-modal__label add-event-modal__label--select">Select</span>
        <div className="add-event-modal__type-toggle">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`add-event-modal__type-option ${form.type === type ? 'add-event-modal__type-option--active' : ''}`}
              onClick={() => handleTypeSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <label className="add-event-modal__field">
        <span className="add-event-modal__label">Name</span>
        <input
          type="text"
          placeholder="e.g. North Mumbai Job Fair/Job Drive"
          value={form.name}
          onChange={handleChange('name')}
          className="add-event-modal__input"
        />
      </label>

      <div className="add-event-modal__grid">
        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Date</span>
          <div className="add-event-modal__date-input">
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={form.date}
              onChange={handleChange('date')}
              className="add-event-modal__input"
            />
            <Calendar size={16} className="add-event-modal__date-icon" />
          </div>
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Time</span>
          <input
            type="text"
            placeholder="e.g. 10:00 AM to 4:00 PM"
            value={form.time}
            onChange={handleChange('time')}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Venue</span>
          <input
            type="text"
            placeholder="e.g. Community hall"
            value={form.venue}
            onChange={handleChange('venue')}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Address</span>
          <input
            type="text"
            placeholder="Enter full Aaddress....."
            value={form.address}
            onChange={handleChange('address')}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Google Maps Link</span>
          <input
            type="text"
            placeholder="https://maps.google.com/.."
            value={form.mapsLink}
            onChange={handleChange('mapsLink')}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Description</span>
          <input
            type="text"
            placeholder="Write about the event....."
            value={form.description}
            onChange={handleChange('description')}
            className="add-event-modal__input"
          />
        </label>
      </div>

      <div className="add-event-modal__footer">
        <button type="button" className="add-event-modal__btn" onClick={handleClose}>Cancel</button>
        <button type="button" className="add-event-modal__btn add-event-modal__btn--primary" onClick={handleSubmit}>Add Event</button>
      </div>
    </Modal>
  );
};

export default AddEventModal;
