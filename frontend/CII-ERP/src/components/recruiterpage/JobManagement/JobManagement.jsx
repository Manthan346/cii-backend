import React, { useState } from 'react';
import JobManagementList from './JobManagementList/JobManagementList';
import CreateJobForm from './CreateJobForm/CreateJobForm';
import JobDetails from './JobDetails/JobDetails';
import { jobs as initialJobs } from '../data';

/**
 * JobManagement (Recruiter)
 *
 * Owns the jobs list and switches between three views entirely on
 * the client, without extra routes:
 *   - 'list'    -> JobManagementList (filter bar + table + Create Job button)
 *   - 'create'  -> CreateJobForm (opened by the Create Job button, or by
 *                  "Edit" on a row - editing just reopens the same form)
 *   - 'details' -> JobDetails (opened by "View" in a row's action menu)
 *
 * "Close job" is handled right from the row menu without leaving the
 * list - it just flips that job's status to Closed in state.
 */
const JobManagement = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'details'
  const [selectedJobId, setSelectedJobId] = useState(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const goToList = () => setView('list');

  const handleViewJob = (jobId) => {
    setSelectedJobId(jobId);
    setView('details');
  };

  const handleEditJob = (jobId) => {
    // TODO: prefill CreateJobForm with this job's data once an edit mode is built.
    setSelectedJobId(jobId);
    setView('create');
  };

  const handleCloseJobStatus = (jobId) => {
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: 'Closed' } : job)));
  };

  const handleCreateJob = (jobPayload) => {
    setJobs((prev) => [{ ...jobPayload, id: `job-${prev.length + 1}` }, ...prev]);
    goToList();
  };

  if (view === 'create') {
    return <CreateJobForm onCancel={goToList} onSubmit={handleCreateJob} />;
  }

  if (view === 'details' && selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={goToList}
        onEdit={() => handleEditJob(selectedJob.id)}
        onCloseJob={() => handleCloseJobStatus(selectedJob.id)}
      />
    );
  }

  return (
    <JobManagementList
      jobs={jobs}
      onCreateJob={() => setView('create')}
      onViewJob={handleViewJob}
      onEditJob={handleEditJob}
      onCloseJob={handleCloseJobStatus}
    />
  );
};

export default JobManagement;
