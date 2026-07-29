import { useState } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { Dropdown, Button } from '../../../shared';
import {
  trainers,
  courseSelectOptions,
  sessionTimeOptions,
  classroomOptions,
  daysOfWeek,
} from '../../../data';
import './CreateBatch.css';
const EMPTY_FORM = {
  batchName: '',
  batchCode: '',
  course: '',
  maxCandidates: '',
  startDate: '',
  endDate: '',
  sessionTime: '',
  classroom: '',
  selectedDays: [],
  trainerId: '',
  notes: '',
};

/**
 * CreateBatch
 *
 * Trainer "Create new Batch" view. Two-column layout: a form (Basic
 * Details / Schedule / Trainer Assignment / Additional Notes) on the
 * left, and a live "Batch Summary" + "Tip" panel on the right -
 * matches the reference "Create new Batch" screens.
 *
 * Props:
 *  - onBack: function      -> returns to the Batch List view.
 *  - onCreated: function(batch) -> called with the new batch after a
 *    successful create, once the success toast has been shown.
 */
const CreateBatch = ({ onBack, onCreated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showNameError, setShowNameError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const updateField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };
  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };
  const selectedTrainer = trainers.find((t) => t.id === form.trainerId);
  const handleCreate = () => {
    if (!form.batchName.trim()) {
      setShowNameError(true);
      return;
    }
    setShowNameError(false);
    setShowSuccess(true);
    const newBatch = {
      id: Date.now(),
      code: form.batchCode || form.batchName,
      schedule: form.selectedDays.length
        ? `${form.sessionTime ? 'custom' : 'morning'} . ${form.selectedDays.join('-')}`
        : 'morning . Mon-Fri',
      trainer: selectedTrainer
        ? selectedTrainer.name.toLowerCase()
        : 'unassigned',
      course: form.course || 'Data science',
      progress: 0,
      candidates: 0,
      startDate: form.startDate || '-',
      status: 'Upcoming',
    };
    setTimeout(() => {
      setShowSuccess(false);
      setForm(EMPTY_FORM);
      onCreated?.(newBatch);
    }, 1400);
  };
  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setShowNameError(false);
    onBack?.();
  };
  return (
    <div className={'batch-management-create-batch-content'}>
      <div className={'batch-management-create-batch-page-header'}>
        <div>
          <h1 className={'batch-management-create-batch-title'}>
            Create new Batch
          </h1>
          <p className={'batch-management-create-batch-subtitle'}>
            Set up batch details,schedule,and trainer assignment
          </p>
        </div>
        <Button
          variant="primary"
          icon={ArrowLeft}
          iconPosition="left"
          onClick={onBack}
        >
          back
        </Button>
      </div>

      <div className={'batch-management-create-batch-layout'}>
        {/* ---- Left: form card ---- */}
        <div className={'batch-management-create-batch-form-card'}>
          {showSuccess && (
            <div
              className={'batch-management-create-batch-success-toast'}
              role="status"
            >
              Batch created successfully
            </div>
          )}

          <section className={'batch-management-create-batch-section'}>
            <h3 className={'batch-management-create-batch-section-title'}>
              BASIC DETAILS
            </h3>
            <div className={'batch-management-create-batch-grid2'}>
              <div className={'batch-management-create-batch-field'}>
                <label className={'batch-management-create-batch-label'}>
                  Batch name{' '}
                  <span className={'batch-management-create-batch-required'}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={'batch-management-create-batch-input'}
                  value={form.batchName}
                  onChange={updateField('batchName')}
                />
                {showNameError && (
                  <p className={'batch-management-create-batch-error-text'}>
                    Batch name is required
                  </p>
                )}
              </div>

              <div className={'batch-management-create-batch-field'}>
                <label className={'batch-management-create-batch-label'}>
                  Batch code{' '}
                  <span className={'batch-management-create-batch-required'}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={'batch-management-create-batch-input'}
                  placeholder="eg DS-26"
                  value={form.batchCode}
                  onChange={updateField('batchCode')}
                />
              </div>

              <Dropdown
                label="course *"
                options={courseSelectOptions}
                value={form.course || courseSelectOptions[0]}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    course: val,
                  }))
                }
              />

              <div className={'batch-management-create-batch-field'}>
                <label className={'batch-management-create-batch-label'}>
                  Maximum candidate{' '}
                  <span className={'batch-management-create-batch-required'}>
                    *
                  </span>
                </label>
                <input
                  type="number"
                  className={'batch-management-create-batch-input'}
                  placeholder="eg-30"
                  value={form.maxCandidates}
                  onChange={updateField('maxCandidates')}
                />
              </div>
            </div>
          </section>

          <section className={'batch-management-create-batch-section'}>
            <h3 className={'batch-management-create-batch-section-title'}>
              SCHEDULE
            </h3>
            <div className={'batch-management-create-batch-grid2'}>
              <div className={'batch-management-create-batch-field'}>
                <label className={'batch-management-create-batch-label'}>
                  Start date{' '}
                  <span className={'batch-management-create-batch-required'}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={'batch-management-create-batch-input'}
                  placeholder="dd-mm-yy"
                  value={form.startDate}
                  onChange={updateField('startDate')}
                />
              </div>

              <div className={'batch-management-create-batch-field'}>
                <label className={'batch-management-create-batch-label'}>
                  End date (Expected){' '}
                  <span className={'batch-management-create-batch-required'}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={'batch-management-create-batch-input'}
                  placeholder="dd-mm-yy"
                  value={form.endDate}
                  onChange={updateField('endDate')}
                />
              </div>

              <Dropdown
                label="Session time *"
                options={sessionTimeOptions}
                value={form.sessionTime || sessionTimeOptions[0]}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    sessionTime: val,
                  }))
                }
              />

              <Dropdown
                label="Classroom/mode"
                options={classroomOptions}
                value={form.classroom || classroomOptions[0]}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    classroom: val,
                  }))
                }
              />
            </div>

            <div className={'batch-management-create-batch-field'}>
              <label className={'batch-management-create-batch-label'}>
                Day of week{' '}
                <span className={'batch-management-create-batch-required'}>
                  *
                </span>
              </label>
              <div className={'batch-management-create-batch-day-row'}>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`${'batch-management-create-batch-day-pill'} ${form.selectedDays.includes(day) ? 'batch-management-create-batch-day-pill-active' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={'batch-management-create-batch-section'}>
            <h3 className={'batch-management-create-batch-section-title'}>
              TRAINER ASSIMENT
            </h3>
            <div className={'batch-management-create-batch-trainer-grid'}>
              {trainers.map((trainer) => (
                <label
                  key={trainer.id}
                  className={`${'batch-management-create-batch-trainer-card'} ${form.trainerId === trainer.id ? 'batch-management-create-batch-trainer-card-active' : ''}`}
                >
                  <input
                    type="radio"
                    name="trainer"
                    className={'batch-management-create-batch-trainer-radio'}
                    checked={form.trainerId === trainer.id}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        trainerId: trainer.id,
                      }))
                    }
                  />
                  <span
                    className={'batch-management-create-batch-trainer-initials'}
                  >
                    {trainer.initials}
                  </span>
                  <span
                    className={'batch-management-create-batch-trainer-text'}
                  >
                    <span
                      className={'batch-management-create-batch-trainer-name'}
                    >
                      {trainer.name}
                    </span>
                    <span
                      className={'batch-management-create-batch-trainer-meta'}
                    >
                      {trainer.meta}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={'batch-management-create-batch-section'}>
            <h3 className={'batch-management-create-batch-section-title'}>
              ADDITIONAL NOTES
            </h3>
            <textarea
              className={'batch-management-create-batch-textarea'}
              placeholder="Any special instuction for this batch"
              rows={3}
              value={form.notes}
              onChange={updateField('notes')}
            />
          </section>

          <div className={'batch-management-create-batch-actions-row'}>
            <Button variant="outline" onClick={handleCancel}>
              Cancle
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Batch
            </Button>
          </div>
        </div>

        {/* ---- Right: summary + tip ---- */}
        <div className={'batch-management-create-batch-sidebar'}>
          <div className={'batch-management-create-batch-summary-card'}>
            <h3 className={'batch-management-create-batch-summary-title'}>
              Batch Summary
            </h3>
            <p className={'batch-management-create-batch-summary-subtitle'}>
              Review before creating
            </p>

            <dl className={'batch-management-create-batch-summary-list'}>
              <div className={'batch-management-create-batch-summary-row'}>
                <dt>Course</dt>
                <dd>{form.course || 'Data science'}</dd>
              </div>
              <div className={'batch-management-create-batch-summary-row'}>
                <dt>Capacity</dt>
                <dd>{form.maxCandidates || 30}</dd>
              </div>
              <div className={'batch-management-create-batch-summary-row'}>
                <dt>Schedule</dt>
                <dd>
                  {form.selectedDays.length
                    ? form.selectedDays.join(', ')
                    : 'Mon -Fri'}
                </dd>
              </div>
              <div className={'batch-management-create-batch-summary-row'}>
                <dt>Trainer</dt>
                <dd>
                  {selectedTrainer ? selectedTrainer.name : 'Rohit mehta'}
                </dd>
              </div>
              <div className={'batch-management-create-batch-summary-row'}>
                <dt>Status on save</dt>
                <dd className={'batch-management-create-batch-summary-status'}>
                  Upcoming
                </dd>
              </div>
            </dl>
          </div>

          <div className={'batch-management-create-batch-tip-card'}>
            <div className={'batch-management-create-batch-tip-title'}>
              <Lightbulb size={16} />
              <span>Tip</span>
            </div>
            <p className={'batch-management-create-batch-tip-text'}>
              You can add candidate to this batch right after creating it,from
              the batch detail page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateBatch;
