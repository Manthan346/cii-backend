import { useState } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Dropdown, Button } from "../../../shared";
import { trainers, courseSelectOptions, sessionTimeOptions, classroomOptions, daysOfWeek } from "../../../data";
import styles from "./CreateBatch.module.css";

const EMPTY_FORM = {
  batchName: "",
  batchCode: "",
  course: "",
  maxCandidates: "",
  startDate: "",
  endDate: "",
  sessionTime: "",
  classroom: "",
  selectedDays: [],
  trainerId: "",
  notes: "",
};

/**
 * CreateBatch
 *
 * Staff "Create new Batch" view. Two-column layout: a form (Basic
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
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
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
        ? `${form.sessionTime ? "custom" : "morning"} . ${form.selectedDays.join("-")}`
        : "morning . Mon-Fri",
      trainer: selectedTrainer ? selectedTrainer.name.toLowerCase() : "unassigned",
      course: form.course || "Data science",
      progress: 0,
      candidates: 0,
      startDate: form.startDate || "-",
      status: "Upcoming",
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
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Create new Batch</h1>
          <p className={styles.subtitle}>Set up batch details,schedule,and trainer assignment</p>
        </div>
        <Button variant="primary" icon={ArrowLeft} iconPosition="left" onClick={onBack}>
          back
        </Button>
      </div>

      <div className={styles.layout}>
        {/* ---- Left: form card ---- */}
        <div className={styles.formCard}>
          {showSuccess && (
            <div className={styles.successToast} role="status">
              Batch created successfully
            </div>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>BASIC DETAILS</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Batch name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={form.batchName}
                  onChange={updateField("batchName")}
                />
                {showNameError && <p className={styles.errorText}>Batch name is required</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Batch code <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="eg DS-26"
                  value={form.batchCode}
                  onChange={updateField("batchCode")}
                />
              </div>

              <Dropdown
                label="course *"
                options={courseSelectOptions}
                value={form.course || courseSelectOptions[0]}
                onChange={(val) => setForm((prev) => ({ ...prev, course: val }))}
              />

              <div className={styles.field}>
                <label className={styles.label}>
                  Maximum candidate <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="eg-30"
                  value={form.maxCandidates}
                  onChange={updateField("maxCandidates")}
                />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SCHEDULE</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Start date <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="dd-mm-yy"
                  value={form.startDate}
                  onChange={updateField("startDate")}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  End date (Expected) <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="dd-mm-yy"
                  value={form.endDate}
                  onChange={updateField("endDate")}
                />
              </div>

              <Dropdown
                label="Session time *"
                options={sessionTimeOptions}
                value={form.sessionTime || sessionTimeOptions[0]}
                onChange={(val) => setForm((prev) => ({ ...prev, sessionTime: val }))}
              />

              <Dropdown
                label="Classroom/mode"
                options={classroomOptions}
                value={form.classroom || classroomOptions[0]}
                onChange={(val) => setForm((prev) => ({ ...prev, classroom: val }))}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Day of week <span className={styles.required}>*</span>
              </label>
              <div className={styles.dayRow}>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.dayPill} ${
                      form.selectedDays.includes(day) ? styles.dayPillActive : ""
                    }`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>TRAINER ASSIMENT</h3>
            <div className={styles.trainerGrid}>
              {trainers.map((trainer) => (
                <label
                  key={trainer.id}
                  className={`${styles.trainerCard} ${
                    form.trainerId === trainer.id ? styles.trainerCardActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="trainer"
                    className={styles.trainerRadio}
                    checked={form.trainerId === trainer.id}
                    onChange={() => setForm((prev) => ({ ...prev, trainerId: trainer.id }))}
                  />
                  <span className={styles.trainerInitials}>{trainer.initials}</span>
                  <span className={styles.trainerText}>
                    <span className={styles.trainerName}>{trainer.name}</span>
                    <span className={styles.trainerMeta}>{trainer.meta}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>ADDITIONAL NOTES</h3>
            <textarea
              className={styles.textarea}
              placeholder="Any special instuction for this batch"
              rows={3}
              value={form.notes}
              onChange={updateField("notes")}
            />
          </section>

          <div className={styles.actionsRow}>
            <Button variant="outline" onClick={handleCancel}>
              Cancle
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Batch
            </Button>
          </div>
        </div>

        {/* ---- Right: summary + tip ---- */}
        <div className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Batch Summary</h3>
            <p className={styles.summarySubtitle}>Review before creating</p>

            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>Course</dt>
                <dd>{form.course || "Data science"}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Capacity</dt>
                <dd>{form.maxCandidates || 30}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Schedule</dt>
                <dd>{form.selectedDays.length ? form.selectedDays.join(", ") : "Mon -Fri"}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Trainer</dt>
                <dd>{selectedTrainer ? selectedTrainer.name : "Rohit mehta"}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Status on save</dt>
                <dd className={styles.summaryStatus}>Upcoming</dd>
              </div>
            </dl>
          </div>

          <div className={styles.tipCard}>
            <div className={styles.tipTitle}>
              <Lightbulb size={16} />
              <span>Tip</span>
            </div>
            <p className={styles.tipText}>
              You can add candidate to this batch right after creating it,from the batch detail page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBatch;
