import React from 'react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import Pagination from '../../../shared/Pagination/Pagination';
import './ShortTermTrainingTable.css';

const STATUS_TONE = {
  upcoming: 'info',
  completed: 'success',
};

/**
 * ShortTermTrainingTable
 *
 * "Short term trainings - N results" list: training identity, type,
 * schedule, trainer, participants (current/total), and status. Unlike
 * the Courses catalog table, status here uses the filled StatusPill
 * badge rather than StatusDot, matching the reference design.
 *
 * Props:
 *  - trainings: array of { id, name, type, duration, startDate,
 *               endDate, trainer, participants: { current, total },
 *               status } - see data/courseManagementData.js ->
 *               shortTermTrainingList for the shape. `status` is
 *               'upcoming' | 'completed'.
 *  - pagination: { currentPage, totalPages, pageSize, totalResults }
 *  - onPageChange: function(page)
 */
const ShortTermTrainingTable = ({ trainings = [], pagination = {}, onPageChange }) => {
  const {
    currentPage = 1,
    totalPages = 1,
    pageSize = trainings.length,
    totalResults = trainings.length,
  } = pagination;

  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <SectionCard title={`Short term trainings - ${totalResults.toLocaleString()} results`}>
      <div className="admin-table-wrap">
        <table className="admin-short-term-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Trainer</th>
              <th>Participants</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id}>
                <td className="admin-short-term-table__name">{training.name}</td>
                <td>{training.type}</td>
                <td>{training.duration}</td>
                <td>{training.startDate}</td>
                <td>{training.endDate}</td>
                <td>{training.trainer}</td>
                <td>
                  {training.participants.current}/{training.participants.total}
                </td>
                <td>
                  <StatusPill tone={STATUS_TONE[training.status] || 'neutral'}>
                    {training.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-short-term-table__footer">
        <span className="admin-short-term-table__showing">
          Showing {rangeStart}-{rangeEnd} of {totalResults.toLocaleString()} courses
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </SectionCard>
  );
};

export default ShortTermTrainingTable;
