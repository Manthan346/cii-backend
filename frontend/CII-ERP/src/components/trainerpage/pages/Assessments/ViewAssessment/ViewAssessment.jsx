import { ExternalLink, X } from "lucide-react";
import { Button } from "../../../shared";
import { AssessmentFields } from "../CreateAssessment/CreateAssessment";
import "../AssessmentDialog/AssessmentDialog.css";
import "./ViewAssessment.css";

export default function ViewAssessment({ assessment, onClose }) {
  return (
    <div
      className="assessment-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="View assessment"
    >
      <div className="assessment-dialog">
        <div className="assessment-dialog-header">
          <div>
            <p>Trainer resources</p>
            <h2>Assessment details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assessment details"
          >
            <X size={18} />
          </button>
        </div>
        <AssessmentFields form={assessment} setForm={() => {}} readOnly />
        <div className="assessment-dialog-actions">
          <a
            className="assessment-link-button"
            href={assessment.assessment_link}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} /> Open assessment link
          </a>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
