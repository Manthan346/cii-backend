import React, { useState } from 'react';
import ApplicationsList from './ApplicationsList/ApplicationsList';
import CandidateProfile from './CandidateProfile/CandidateProfile';
import { applications as initialApplications } from '../data';

/**
 * Applications (Recruiter)
 *
 * Owns the applications list and switches between two views entirely
 * on the client, same pattern as Job Management:
 *   - 'list'    -> ApplicationsList (filter bar + table + pagination)
 *   - 'profile' -> CandidateProfile (opened by a row's "View Profile")
 *
 * "Shortlist" / "Reject" / "Schedule Interview" on CandidateProfile
 * all just update that one candidate's `status` in place via
 * handleUpdateStatus - same local-state pattern used everywhere else
 * in this app (no backend yet).
 */
const Applications = () => {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedId, setSelectedId] = useState(null);

  const selectedCandidate = applications.find((item) => item.id === selectedId) ?? null;

  const handleUpdateStatus = (nextStatus) => {
    setApplications((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, status: nextStatus } : item))
    );
  };

  if (selectedCandidate) {
    return (
      <CandidateProfile
        candidate={selectedCandidate}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return <ApplicationsList applications={applications} onViewProfile={setSelectedId} />;
};

export default Applications;
