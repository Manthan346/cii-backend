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
      className={'overlay'}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit event' : 'Create event'}
    >
      <div className={'modal'}>
        <div className={'header'}>
          <h2 className={'title'}>{isEdit ? 'Edit Event' : 'Create Event'}</h2>
          <button
            type="button"
            className={'closeBtn'}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={'field'}>
          <label className={'label'}>
            Event title <span className={'required'}>*</span>
          </label>
          <input
            type="text"
            className={'input'}
            placeholder="eg AI in Industry - Seminar"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={'row'}>
          <div className={'field'}>
            <label className={'label'}>Event type</label>
            <select
              className={'select'}
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

          <div className={'field'}>
            <label className={'label'}>Mode</label>
            <select
              className={'select'}
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

        <div className={'row'}>
          <div className={'field'}>
            <label className={'label'}>
              Date <span className={'required'}>*</span>
            </label>
            <input
              type="date"
              className={'input'}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className={'field'}>
            <label className={'label'}>Time</label>
            <input
              type="text"
              className={'input'}
              placeholder="eg 10:00 AM - 12:00 PM"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <div className={'field'}>
          <label className={'label'}>Venue / meeting link</label>
          <input
            type="text"
            className={'input'}
            placeholder="eg CII Auditorium, Mumbai or Zoom link"
            value={venue}
            onChange={(event) => setVenue(event.target.value)}
          />
        </div>

        <div className={'row'}>
          <div className={'field'}>
            <label className={'label'}>Batch</label>
            <select
              className={'select'}
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

          <div className={'field'}>
            <label className={'label'}>Max participants</label>
            <input
              type="number"
              min="0"
              className={'input'}
              placeholder="eg 100"
              value={maxParticipants}
              onChange={(event) => setMaxParticipants(event.target.value)}
            />
          </div>
        </div>

        <div className={'field'}>
          <label className={'label'}>Description</label>
          <textarea
            className={'textarea'}
            rows={3}
            placeholder="Short description shown to candidates when they view this event"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={'actions'}>
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
