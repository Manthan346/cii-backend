import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../shared";
import {
  fetchMyBatches,
  updateAssessment,
} from "../../../../../../api/trainer/assessmentService";
import { AssessmentFields } from "../CreateAssessment/CreateAssessment";
import "../AssessmentDialog/AssessmentDialog.css";
import "./EditAssessment.css";

export default function EditAssessment({ assessment, onClose, onSubmit }) {
  const [form, setForm] = useState(assessment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchMyBatches()
      .then(setBatches)
      .catch(() => setError("Unable to load batch codes."));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await updateAssessment({
        assessmentId: assessment.assessment_id ?? assessment.id,
        title: form.title,
        assessmentDesc: form.assessment_desc,
        assessmentDate: form.assessment_date,
        assessmentDuration: Number(form.assessment_duration),
        assessmentLink: form.assessment_link,
        assessmentType: form.assessment_type,
        questions: Number(form.no_of_questions),
        isShow: form.is_show ?? true,
      });
      onSubmit(form);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update assessment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="assessment-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Edit assessment"
    >
      <div className="assessment-dialog">
        <div className="assessment-dialog-header">
          <div>
            <p>Trainer resources</p>
            <h2>Edit assessment</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit assessment"
          >
            <X size={18} />
          </button>
        </div>
        {error && <p className="assessment-dialog-error">{error}</p>}
        <AssessmentFields form={form} setForm={setForm} batches={batches} />
        <div className="assessment-dialog-actions">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
