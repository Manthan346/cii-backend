import React from "react";
import { SectionCard, DonutChart } from "../../../shared";
import { candidateStatusDistribution } from "../../../data";
import "./CandidateStatusDistribution.css";

/**
 * CandidateStatusDistribution
 *
 * Dashboard card showing the candidate pipeline breakdown (New, Not
 * interested, Interested, Follow up, Called) as a donut chart with a
 * color-coded legend. Composed with the reusable <SectionCard> and
 * <DonutChart> from /shared; only the data lives here.
 */
const CandidateStatusDistribution = () => {
  return (
    <SectionCard title="Candidate Status Distribution" className="candidate-status-distribution">
      <DonutChart data={candidateStatusDistribution} />
    </SectionCard>
  );
};

export default CandidateStatusDistribution;
