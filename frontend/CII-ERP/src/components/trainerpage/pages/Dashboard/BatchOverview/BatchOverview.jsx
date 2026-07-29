import React from 'react';
import { SectionCard, StatusBadge } from '../../../shared';
import { batchOverview } from '../../../data';
import './BatchOverview.css';

/**
 * BatchOverview
 *
 * Dashboard table listing each active batch with its course, candidate
 * count, and status pill. Composed with the reusable <SectionCard> and
 * <StatusBadge> from /shared. (Progress column removed per request.)
 */
const BatchOverview = () => {
  return (
    <SectionCard title="Batch Overview" className="batch-overview">
      <div className="batch-overview__table">
        <div className="batch-overview__head-row">
          <span>Batch</span>
          <span>Course</span>
          <span>Candidates</span>
          <span>Status</span>
        </div>

        {batchOverview.map((batch) => (
          <div className="batch-overview__row" key={batch.id}>
            <span className="batch-overview__code">{batch.batch}</span>
            <span className="batch-overview__course">{batch.course}</span>
            <span className="batch-overview__candidates">
              {batch.candidates}
            </span>
            <span className="batch-overview__status">
              <StatusBadge status={batch.status} />
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default BatchOverview;
