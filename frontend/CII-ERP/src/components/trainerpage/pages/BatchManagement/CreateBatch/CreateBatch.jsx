import { useState, useEffect } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Dropdown, Button } from "../../../shared";
import {
  createBatch,
  fetchCourseOptions,
} from "../../../../../../api/trainer/batchService";
import "./CreateBatch.css";

const EMPTY_FORM = {
  batchName: "",
  batchCode: "",
  courseId: "",
  maxCandidates: "",
  startDate: "",
  endDate: "",
  notes: "",
};

const CreateBatch = ({ onBack, onCreated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [courses, setCourses] = useState([]);
  const [showNameError, setShowNameError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCourseOptions()
      .then((data) => !cancelled && setCourses(data))
      .catch(() => !cancelled && setCourses([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCreate = async () => {
    if (!form.batchName.trim()) {
      setShowNameError(true);
      return;
    }
    setShowNameError(false);
    setSubmitError(null);
    setSubmitting(true);

    try {
      const created = await createBatch(form);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setForm(EMPTY_FORM);
        onCreated?.(created);
      }, 1400);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create batch.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setShowNameError(false);
    setSubmitError(null);
    onBack?.();
  };

  const courseOptions = courses.map((c) => ({ label: c.name, value: c.id }));
  const selectedCourseName =
    courses.find((c) => c.id === form.courseId)?.name || "Select course";

  return (
    <div className={"batch-management-create-batch-content"}>
      <div className={"batch-management-create-batch-page-header"}>
        <div>
          <h1 className={"batch-management-create-batch-title"}>
            Create new Batch
          </h1>
          <p className={"batch-management-create-batch-subtitle"}>
            Set up batch details
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

      <div className={"batch-management-create-batch-layout"}>
        <div className={"batch-management-create-batch-form-card"}>
          {showSuccess && (
            <div
              className={"batch-management-create-batch-success-toast"}
              role="status"
            >
              Batch created successfully
            </div>
          )}

          {submitError && (
            <div
              className={"batch-management-create-batch-success-toast"}
              style={{ background: "#fef2f2", color: "#dc2626" }}
              role="alert"
            >
              {submitError}
            </div>
          )}

          <section className={"batch-management-create-batch-section"}>
            <h3 className={"batch-management-create-batch-section-title"}>
              BASIC DETAILS
            </h3>
            <div className={"batch-management-create-batch-grid2"}>
              <div className={"batch-management-create-batch-field"}>
                <label className={"batch-management-create-batch-label"}>
                  Batch name{" "}
                  <span className={"batch-management-create-batch-required"}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={"batch-management-create-batch-input"}
                  value={form.batchName}
                  onChange={updateField("batchName")}
                />
                {showNameError && (
                  <p className={"batch-management-create-batch-error-text"}>
                    Batch name is required
                  </p>
                )}
              </div>

              <div className={"batch-management-create-batch-field"}>
                <label className={"batch-management-create-batch-label"}>
                  Batch code{" "}
                  <span className={"batch-management-create-batch-required"}>
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className={"batch-management-create-batch-input"}
                  placeholder="eg DS-26"
                  value={form.batchCode}
                  onChange={updateField("batchCode")}
                />
              </div>

              <Dropdown
                label="course *"
                options={courseOptions}
                value={form.courseId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, courseId: value }))
                }
              />

              <div className={"batch-management-create-batch-field"}>
                <label className={"batch-management-create-batch-label"}>
                  Maximum candidate{" "}
                  <span className={"batch-management-create-batch-required"}>
                    *
                  </span>
                </label>
                <input
                  type="number"
                  className={"batch-management-create-batch-input"}
                  placeholder="eg-30"
                  value={form.maxCandidates}
                  onChange={updateField("maxCandidates")}
                />
              </div>
            </div>
          </section>

          <section className={"batch-management-create-batch-section"}>
            <h3 className={"batch-management-create-batch-section-title"}>
              SCHEDULE
            </h3>
            <div className={"batch-management-create-batch-grid2"}>
              <div className={"batch-management-create-batch-field"}>
                <label className={"batch-management-create-batch-label"}>
                  Start date{" "}
                  <span className={"batch-management-create-batch-required"}>
                    *
                  </span>
                </label>
                <input
                  type="date"
                  className={"batch-management-create-batch-input"}
                  value={form.startDate}
                  onChange={updateField("startDate")}
                />
              </div>

              <div className={"batch-management-create-batch-field"}>
                <label className={"batch-management-create-batch-label"}>
                  End date (Expected){" "}
                  <span className={"batch-management-create-batch-required"}>
                    *
                  </span>
                </label>
                <input
                  type="date"
                  className={"batch-management-create-batch-input"}
                  value={form.endDate}
                  onChange={updateField("endDate")}
                />
              </div>
            </div>
          </section>

          <section className={"batch-management-create-batch-section"}>
            <h3 className={"batch-management-create-batch-section-title"}>
              ADDITIONAL NOTES
            </h3>
            <div className={"batch-management-create-batch-field"}>
              <label className={"batch-management-create-batch-label"}>
                Description
              </label>
              <textarea
                className={"batch-management-create-batch-input"}
                placeholder="Any special instruction for this batch"
                rows={3}
                value={form.notes}
                onChange={updateField("notes")}
              />
            </div>
          </section>

          <div className={"batch-management-create-batch-actions-row"}>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Batch"}
            </Button>
          </div>
        </div>

        <div className={"batch-management-create-batch-sidebar"}>
          <div className={"batch-management-create-batch-summary-card"}>
            <h3 className={"batch-management-create-batch-summary-title"}>
              Batch Summary
            </h3>
            <p className={"batch-management-create-batch-summary-subtitle"}>
              Review before creating
            </p>
            <dl className={"batch-management-create-batch-summary-list"}>
              <div className={"batch-management-create-batch-summary-row"}>
                <dt>Course</dt>
                <dd>{selectedCourseName}</dd>
              </div>
              <div className={"batch-management-create-batch-summary-row"}>
                <dt>Capacity</dt>
                <dd>{form.maxCandidates || 30}</dd>
              </div>
              <div className={"batch-management-create-batch-summary-row"}>
                <dt>Status on save</dt>
                <dd className={"batch-management-create-batch-summary-status"}>
                  Active
                </dd>
              </div>
            </dl>
          </div>

          <div className={"batch-management-create-batch-tip-card"}>
            <div className={"batch-management-create-batch-tip-title"}>
              <Lightbulb size={16} />
              <span>Tip</span>
            </div>
            <p className={"batch-management-create-batch-tip-text"}>
              You can add candidate to this batch right after creating it, from
              the batch detail page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBatch;
