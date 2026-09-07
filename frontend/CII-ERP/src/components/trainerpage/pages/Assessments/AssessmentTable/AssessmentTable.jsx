import { Eye, Pencil } from "lucide-react";
import "./AssessmentTable.css";

export default function AssessmentTable({ records, onView, onEdit }) {
  return (
    <section className="assessment-table-section">
      <div className="assessment-table-heading">
        <h2>Assessment list</h2>
        <span>{records.length} assessments</span>
      </div>
      <div className="assessment-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Title</th>
              <th>Assessment type</th>
              <th>Assessment date</th>
              <th>No. of questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((assessment) => (
              <tr key={assessment.id}>
                <td>
                  <span className="assessment-table-batch">
                    {assessment.batch_code || assessment.batch_id}
                  </span>
                </td>
                <td className="assessment-table-title">{assessment.title}</td>
                <td>{assessment.assessment_type}</td>
                <td>
                  {assessment.assessment_date_display ||
                    assessment.assessment_date}
                </td>
                <td>{assessment.no_of_questions}</td>
                <td>
                  <div className="assessment-table-actions">
                    <button
                      type="button"
                      onClick={() => onView(assessment)}
                      aria-label={`View ${assessment.title}`}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(assessment)}
                      aria-label={`Edit ${assessment.title}`}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
