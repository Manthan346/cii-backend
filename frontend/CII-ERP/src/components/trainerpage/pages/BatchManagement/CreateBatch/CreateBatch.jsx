import { useState, useEffect } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Dropdown, Button } from "../../../shared";
import {
  createBatch,
  fetchCourseOptions,
  fetchBatchDetails,
  updateBatch,
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
  batchType: "ACADEMIC",
  batchStatus: "ACTIVE",
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isTimeoutError = (error) =>
  error?.code === "ECONNABORTED" ||
  error?.code === "ETIMEDOUT" ||
  /timeout of \d+ms exceeded/i.test(error?.message || "");

const toDateInputValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") {
    const isoDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (isoDate) return isoDate;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CreateBatch = ({ batch, onBack, onCreated }) => {
  const isEditing = Boolean(batch?.id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [courses, setCourses] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(isEditing);
  const [batchLoaded, setBatchLoaded] = useState(!isEditing);
  const [formError, setFormError] = useState("");
  const [originalDates, setOriginalDates] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (isEditing) return undefined;
    let cancelled = false;
    fetchCourseOptions()
      .then((data) => !cancelled && setCourses(data))
      .catch(() => !cancelled && setCourses([]));
    return () => {
      cancelled = true;
    };
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return undefined;
    let cancelled = false;
    setLoadingBatch(true);
    setFormError("");
    fetchBatchDetails(batch.id)
      .then((details) => {
        if (cancelled) return;
        if (!details) {
          setFormError("Batch details could not be found.");
          return;
        }
        const startDate = toDateInputValue(
          details.batch_start_date ?? details.start_date,
        );
        const endDate = toDateInputValue(
          details.batch_end_date ?? details.end_date,
        );
        setForm({
          batchName: details.batch_name ?? batch.code ?? "",
          batchCode: details.batch_code ?? batch.code ?? "",
          courseId: details.course_id ?? "",
          maxCandidates: String(details.max_candidates ?? ""),
          startDate,
          endDate,
          notes: details.batch_desc ?? "",
          batchType: details.batch_type ?? "ACADEMIC",
          batchStatus: details.b_status ?? details.batch_status ?? "",
        });
        setOriginalDates({ startDate, endDate });
        setBatchLoaded(true);
      })
      .catch((error) => {
        if (!cancelled) {
          setFormError(
            error?.response?.data?.message ||
              error.message ||
              "Failed to load batch details.",
          );
        }
      })
      .finally(() => !cancelled && setLoadingBatch(false));
    return () => {
      cancelled = true;
    };
  }, [batch, isEditing]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (isEditing && (!batchLoaded || loadingBatch)) return;
    const errors = {};
    if (!form.batchName.trim()) {
      errors.batchName = "Batch name is required.";
    }
    if (!isEditing && !form.courseId) {
      errors.courseId = "Course is required.";
    }
    if (
      !form.maxCandidates ||
      !Number.isInteger(Number(form.maxCandidates)) ||
      Number(form.maxCandidates) <= 0
    ) {
      errors.maxCandidates = "Maximum candidates must be a positive integer.";
    } else if (
      isEditing &&
      Number(form.maxCandidates) < Number(batch.candidates ?? 0)
    ) {
      errors.maxCandidates = `Maximum candidates cannot be less than the ${batch.candidates} already enrolled.`;
    }
    if (!form.startDate) {
      errors.startDate = "Start date is required.";
    }
    if (!form.endDate) {
      errors.endDate = "End date is required.";
    }
    if (!form.notes.trim()) {
      errors.notes = "Batch description cannot be empty.";
    }
    if (isEditing && !form.batchStatus) {
      setFormError("Batch status is missing from the batch details.");
      return;
    }
    if (
      form.startDate &&
      form.startDate !== originalDates.startDate &&
      form.startDate < getTodayDate()
    ) {
      errors.startDate = "Start date cannot be in the past.";
    }
    if (
      form.endDate &&
      form.endDate !== originalDates.endDate &&
      form.endDate < getTodayDate()
    ) {
      errors.endDate = "End date cannot be in the past.";
    }
    if (
      form.startDate &&
      form.endDate &&
      (form.startDate !== originalDates.startDate ||
        form.endDate !== originalDates.endDate) &&
      form.endDate <= form.startDate
    ) {
      errors.endDate = "End date must be after the start date.";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      const result = isEditing
        ? await updateBatch(batch.id, form, originalDates)
        : await createBatch(form);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (!isEditing) setForm(EMPTY_FORM);
        onCreated?.(result);
      }, 800);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        err.message ||
        `Failed to ${isEditing ? "update" : "create"} batch.`;
      if (isTimeoutError(err)) {
        setFormError(message);
        return;
      }
      const normalizedMessage = message.toLowerCase();
      const field =
        normalizedMessage.includes("course")
          ? "courseId"
          : normalizedMessage.includes("start date") ||
              normalizedMessage.includes("batch_start_date")
            ? "startDate"
            : normalizedMessage.includes("end date") ||
                normalizedMessage.includes("batch_end_date")
              ? "endDate"
              : normalizedMessage.includes("candidate")
                ? "maxCandidates"
                : normalizedMessage.includes("batch_desc") ||
                    normalizedMessage.includes("description")
                  ? "notes"
                  : normalizedMessage.includes("batch_code")
                    ? "batchCode"
                    : normalizedMessage.includes("batch_name")
                      ? "batchName"
                      : null;

      if (field) {
        setFieldErrors({ [field]: message });
      } else {
        setFormError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isEditing) setForm(EMPTY_FORM);
    setFieldErrors({});
    onBack?.();
  };

  const courseOptions = courses.map((c) => ({ label: c.name, value: c.id }));
  const selectedCourseName =
    courses.find((c) => c.id === form.courseId)?.name ||
    (isEditing ? batch.course : "Select course");

  return (
    <div className={"batch-management-create-batch-content"}>
      <div className={"batch-management-create-batch-page-header"}>
        <div>
          <h1 className={"batch-management-create-batch-title"}>
            {isEditing ? "Edit Batch" : "Create new Batch"}
          </h1>
          <p className={"batch-management-create-batch-subtitle"}>
            {isEditing ? "Update batch details" : "Set up batch details"}
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
              Batch {isEditing ? "updated" : "created"} successfully
            </div>
          )}
          {formError && (
            <p className={"batch-management-create-batch-error-text"} role="alert">
              {formError}
            </p>
          )}

          {loadingBatch ? (
            <p>Loading batch details…</p>
          ) : (
            <>

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
                {fieldErrors.batchName && (
                  <p className={"batch-management-create-batch-error-text"}>
                    {fieldErrors.batchName}
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
                {fieldErrors.batchCode && (
                  <p className={"batch-management-create-batch-error-text"}>
                    {fieldErrors.batchCode}
                  </p>
                )}
              </div>

              {isEditing ? (
                <div className={"batch-management-create-batch-field"}>
                  <label className={"batch-management-create-batch-label"}>
                    Course
                  </label>
                  <input
                    type="text"
                    className={"batch-management-create-batch-input"}
                    value={selectedCourseName || "—"}
                    readOnly
                  />
                </div>
              ) : (
                <div>
                  <Dropdown
                    label="course *"
                    options={courseOptions}
                    value={form.courseId}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, courseId: value }));
                      setFieldErrors((prev) => ({ ...prev, courseId: "" }));
                    }}
                  />
                  {fieldErrors.courseId && (
                    <p className={"batch-management-create-batch-error-text"}>
                      {fieldErrors.courseId}
                    </p>
                  )}
                </div>
              )}

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
                  min={isEditing ? batch.candidates ?? 1 : 1}
                  value={form.maxCandidates}
                  onChange={updateField("maxCandidates")}
                />
                {fieldErrors.maxCandidates && (
                  <p className={"batch-management-create-batch-error-text"}>
                    {fieldErrors.maxCandidates}
                  </p>
                )}
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
                  min={isEditing ? undefined : getTodayDate()}
                  value={form.startDate}
                  onChange={updateField("startDate")}
                />
                {fieldErrors.startDate && (
                  <p className={"batch-management-create-batch-error-text"}>
                    {fieldErrors.startDate}
                  </p>
                )}
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
                  min={isEditing ? undefined : getTodayDate()}
                  value={form.endDate}
                  onChange={updateField("endDate")}
                />
                {fieldErrors.endDate && (
                  <p className={"batch-management-create-batch-error-text"}>
                    {fieldErrors.endDate}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={"batch-management-create-batch-section"}>
            <h3 className={"batch-management-create-batch-section-title"}>
              ADDITIONAL NOTES
            </h3>
            <div className={"batch-management-create-batch-field"}>
              <label className={"batch-management-create-batch-label"}>
                Description{" "}
                <span className={"batch-management-create-batch-required"}>
                  *
                </span>
              </label>
              <textarea
                className={"batch-management-create-batch-input"}
                placeholder="Any special instruction for this batch"
                rows={3}
                value={form.notes}
                onChange={updateField("notes")}
              />
              {fieldErrors.notes && (
                <p className={"batch-management-create-batch-error-text"}>
                  {fieldErrors.notes}
                </p>
              )}
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
              onClick={handleSubmit}
              disabled={submitting || loadingBatch || !batchLoaded}
            >
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Batch"}
            </Button>
          </div>
            </>
          )}
        </div>

        <div className={"batch-management-create-batch-sidebar"}>
          <div className={"batch-management-create-batch-summary-card"}>
            <h3 className={"batch-management-create-batch-summary-title"}>
              Batch Summary
            </h3>
            <p className={"batch-management-create-batch-summary-subtitle"}>
              {isEditing ? "Review batch details" : "Review before creating"}
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
                  {isEditing ? "Date-based" : "Active"}
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
              {isEditing
                ? "The course assignment cannot be changed here."
                : "You can add candidates to this batch after creating it."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBatch;
