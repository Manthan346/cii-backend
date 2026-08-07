import React from 'react';
import { ChevronRight } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import './CandidateJourney.css';

/**
 * CandidateJourney
 *
 * Funnel strip showing candidate counts at each stage (Enquiry ->
 * Registered -> Enrolled -> Training -> Completed -> Certified ->
 * Placed). Stages already reached are highlighted via `step.active`.
 *
 * Props:
 *  - steps: array of { id, label, count, active }
 *           see Dashboard/data.js -> candidateJourney for the shape.
 */
const CandidateJourney = ({ steps = [] }) => {
  return (
    <SectionCard title="Candidate Journey">
      <div className="admin-journey">
  {steps.map((step) => (
    <div
      key={step.id}
      className={`admin-journey__step ${
        step.active ? "admin-journey__step--active" : ""
      }`}
    >
      <span className="admin-journey__step-label">
        {step.label}
      </span>
    </div>
  ))}
</div>

      <div className="admin-journey__counts">
        {steps.map((step) => (
          <span className="admin-journey__count" key={step.id}>
            {step.count.toLocaleString()}
          </span>
        ))}
      </div>
    </SectionCard>
  );
};

export default CandidateJourney;
