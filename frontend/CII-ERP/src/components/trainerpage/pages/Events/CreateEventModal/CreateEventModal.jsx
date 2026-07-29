import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../shared';
import { batchOptions } from '../../../data/filterOptions';
import './CreateEventModal.css';

/**
 * CreateEventModal (Events)
 *
 * "+ Create Event" popup form: Title, Type, Mode, Date, Time, Venue /
 * meeting link, Batch, Max participants and a Description textarea.
 * Fires onSave(formValues) so the parent (Events) can prepend a new
 * row into the table and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * creating an event. Also doubles as the Edit form when an
 * `initialValues` event record is passed in.
 */
const BATCH_CHOICES = [
  'All Batches',
  ...batchOptions.filter((option) => !option.toLowerCase().startsWith('all')),
];
export default function CreateEventModal({
  typeOptions = [],
  modeOptions = [],
  initialValues,
  onCancel,
  onSave,
}) {
  const isEdit = Boolean(initialValues);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [type, setType] = useState(initialValues?.type || typeOptions[0] || '');
  const [mode, setMode] = useState(
    initialValues?.mode || modeOptions[0] || 'Offline',
  );
  const [date, setDate] = useState(initialValues?.rawDate || '');
  const [time, setTime] = useState(initialValues?.time || '');
  const [venue, setVenue] = useState(initialValues?.venue || '');
  const [batch, setBatch] = useState(initialValues?.batch || BATCH_CHOICES[0]);
  const [maxParticipants, setMaxParticipants] = useState(
    initialValues?.maxParticipants || '',
  );
  const [description, setDescription] = useState(
    initialValues?.description || '',
  );
  const isValid = title.trim().length > 0 && date.trim().length > 0;
  const handleSave = () => {
    if (!isValid) return;
    onSave?.({
      title: title.trim(),
      type,
      mode,
      date,
      time: time.trim(),
      venue: venue.trim(),
      batch,
      maxParticipants: maxParticipants || 0,
      description: description.trim(),
    });
  };
  return (
    <div
      className={'events-create-event-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit event' : 'Create event'}
    >
      <div className={'events-create-event-modal-modal'}>
        <div className={'events-create-event-modal-header'}>
          <h2 className={'events-create-event-modal-title'}>
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            type="button"
            className={'events-create-event-modal-close-btn'}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={'events-create-event-modal-field'}>
          <label className={'events-create-event-modal-label'}>
            Event title{' '}
            <span className={'events-create-event-modal-required'}>*</span>
          </label>
          <input
            type="text"
            className={'events-create-event-modal-input'}
            placeholder="eg AI in Industry - Seminar"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={'events-create-event-modal-row'}>
          <div className={'events-create-event-modal-field'}>
            <label className={'events-create-event-modal-label'}>
              Event type
            </label>
            <select
              className={'events-create-event-modal-select'}
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={'events-create-event-modal-field'}>
            <label className={'events-create-event-modal-label'}>Mode</label>
            <select
              className={'events-create-event-modal-select'}
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              {modeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={'events-create-event-modal-row'}>
          <div className={'events-create-event-modal-field'}>
            <label className={'events-create-event-modal-label'}>
              Date{' '}
              <span className={'events-create-event-modal-required'}>*</span>
            </label>
            <input
              type="date"
              className={'events-create-event-modal-input'}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className={'events-create-event-modal-field'}>
            <label className={'events-create-event-modal-label'}>Time</label>
            <input
              type="text"
              className={'events-create-event-modal-input'}
              placeholder="eg 10:00 AM - 12:00 PM"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <div className={'events-create-event-modal-field'}>
          <label className={'events-create-event-modal-label'}>
            Venue / meeting link
          </label>
          <input
            type="text"
            className={'events-create-event-modal-input'}
            placeholder="eg CII Auditorium, Mumbai or Zoom link"
            value={venue}
            onChange={(event) => setVenue(event.target.value)}
          />
        </div>

        <div className={'events-create-event-modal-row'}>
          <div className={'events-create-event-modal-field'}>
            <label className={'events-create-event-modal-label'}>Batch</label>
            <select
              className={'events-create-event-modal-select'}
              value={batch}
              onChange={(event) => setBatch(event.target.value)}
            >
              {BATCH_CHOICES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={'events-create-event-modal-field'}>
            <label className={'events-create-event-modal-label'}>
              Max participants
            </label>
            <input
              type="number"
              min="0"
              className={'events-create-event-modal-input'}
              placeholder="eg 100"
              value={maxParticipants}
              onChange={(event) => setMaxParticipants(event.target.value)}
            />
          </div>
        </div>

        <div className={'events-create-event-modal-field'}>
          <label className={'events-create-event-modal-label'}>
            Description
          </label>
          <textarea
            className={'events-create-event-modal-textarea'}
            rows={3}
            placeholder="Short description shown to candidates when they view this event"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={'events-create-event-modal-actions'}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!isValid}>
            {isEdit ? 'Save changes' : 'Create event'}
          </Button>
        </div>
      </div>
    </div>
  );
}
