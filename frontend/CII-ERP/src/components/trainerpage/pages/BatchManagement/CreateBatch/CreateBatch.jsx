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
    <div className={'content'}>
      <div className={'pageHeader'}>
        <div>
          <h1 className={'title'}>Create new Batch</h1>
          <p className={'subtitle'}>
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

      <div className={'layout'}>
        {/* ---- Left: form card ---- */}
        <div className={'formCard'}>
          {showSuccess && (
            <div className={'successToast'} role="status">
              Batch created successfully
            </div>
          )}

          <section className={'section'}>
            <h3 className={'sectionTitle'}>BASIC DETAILS</h3>
            <div className={'grid2'}>
              <div className={'field'}>
                <label className={'label'}>
                  Batch name <span className={'required'}>*</span>
                </label>
                <input
                  type="text"
                  className={'input'}
                  value={form.batchName}
                  onChange={updateField('batchName')}
                />
                {showNameError && (
                  <p className={'errorText'}>Batch name is required</p>
                )}
              </div>

              <div className={'field'}>
                <label className={'label'}>
                  Batch code <span className={'required'}>*</span>
                </label>
                <input
                  type="text"
                  className={'input'}
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

              <div className={'field'}>
                <label className={'label'}>
                  Maximum candidate <span className={'required'}>*</span>
                </label>
                <input
                  type="number"
                  className={'input'}
                  placeholder="eg-30"
                  value={form.maxCandidates}
                  onChange={updateField('maxCandidates')}
                />
              </div>
            </div>
          </section>

          <section className={'section'}>
            <h3 className={'sectionTitle'}>SCHEDULE</h3>
            <div className={'grid2'}>
              <div className={'field'}>
                <label className={'label'}>
                  Start date <span className={'required'}>*</span>
                </label>
                <input
                  type="text"
                  className={'input'}
                  placeholder="dd-mm-yy"
                  value={form.startDate}
                  onChange={updateField('startDate')}
                />
              </div>

              <div className={'field'}>
                <label className={'label'}>
                  End date (Expected) <span className={'required'}>*</span>
                </label>
                <input
                  type="text"
                  className={'input'}
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

            <div className={'field'}>
              <label className={'label'}>
                Day of week <span className={'required'}>*</span>
              </label>
              <div className={'dayRow'}>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`${'dayPill'} ${form.selectedDays.includes(day) ? 'dayPillActive' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={'section'}>
            <h3 className={'sectionTitle'}>TRAINER ASSIMENT</h3>
            <div className={'trainerGrid'}>
              {trainers.map((trainer) => (
                <label
                  key={trainer.id}
                  className={`${'trainerCard'} ${form.trainerId === trainer.id ? 'trainerCardActive' : ''}`}
                >
                  <input
                    type="radio"
                    name="trainer"
                    className={'trainerRadio'}
                    checked={form.trainerId === trainer.id}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        trainerId: trainer.id,
                      }))
                    }
                  />
                  <span className={'trainerInitials'}>{trainer.initials}</span>
                  <span className={'trainerText'}>
                    <span className={'trainerName'}>{trainer.name}</span>
                    <span className={'trainerMeta'}>{trainer.meta}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={'section'}>
            <h3 className={'sectionTitle'}>ADDITIONAL NOTES</h3>
            <textarea
              className={'textarea'}
              placeholder="Any special instuction for this batch"
              rows={3}
              value={form.notes}
              onChange={updateField('notes')}
            />
          </section>

          <div className={'actionsRow'}>
            <Button variant="outline" onClick={handleCancel}>
              Cancle
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Batch
            </Button>
          </div>
        </div>

        {/* ---- Right: summary + tip ---- */}
        <div className={'sidebar'}>
          <div className={'summaryCard'}>
            <h3 className={'summaryTitle'}>Batch Summary</h3>
            <p className={'summarySubtitle'}>Review before creating</p>

            <dl className={'summaryList'}>
              <div className={'summaryRow'}>
                <dt>Course</dt>
                <dd>{form.course || 'Data science'}</dd>
              </div>
              <div className={'summaryRow'}>
                <dt>Capacity</dt>
                <dd>{form.maxCandidates || 30}</dd>
              </div>
              <div className={'summaryRow'}>
                <dt>Schedule</dt>
                <dd>
                  {form.selectedDays.length
                    ? form.selectedDays.join(', ')
                    : 'Mon -Fri'}
                </dd>
              </div>
              <div className={'summaryRow'}>
                <dt>Trainer</dt>
                <dd>
                  {selectedTrainer ? selectedTrainer.name : 'Rohit mehta'}
                </dd>
              </div>
              <div className={'summaryRow'}>
                <dt>Status on save</dt>
                <dd className={'summaryStatus'}>Upcoming</dd>
              </div>
            </dl>
          </div>

          <div className={'tipCard'}>
            <div className={'tipTitle'}>
              <Lightbulb size={16} />
              <span>Tip</span>
            </div>
            <p className={'tipText'}>
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
