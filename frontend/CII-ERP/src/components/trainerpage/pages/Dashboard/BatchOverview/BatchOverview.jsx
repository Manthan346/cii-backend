import React from 'react';
import { SectionCard, StatusBadge } from '../../../shared';
import './BatchOverview.css';

/**
 * BatchOverview
 *
 * Dashboard table listing each active batch with its course, candidate
 * count, and status pill. Composed with the reusable <SectionCard> and
 * <StatusBadge> from /shared. (Progress column removed per request.)
 */
const BatchOverview = ({ batches = [] }) => {
  return (
    <SectionCard title="Batch Overview" className="batch-overview">
      <div className="batch-overview__table">
        <div className="batch-overview__head-row">
          <span>Batch</span>
          <span>Course</span>
          <span>Candidates</span>
          <span>Status</span>
        </div>

        {batches.map((batch) => (
          <div className="batch-overview__row" key={batch.batchId}>
            <span className="batch-overview__code">{batch.batchName}</span>
            <span className="batch-overview__course">{batch.courseName}</span>
            <span className="batch-overview__candidates">
              {batch.candidateCount}
            </span>
            <span className="batch-overview__status">
              <StatusBadge status={batch.batchStatus} />
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default BatchOverview;
