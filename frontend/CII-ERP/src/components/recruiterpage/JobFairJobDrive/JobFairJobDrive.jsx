import React, { useState } from "react";
import JobFairJobDriveList from "./JobFairJobDriveList/JobFairJobDriveList";
import AddEventModal from "./AddEventModal/AddEventModal";
import ImportModal from "../shared/ImportModal/ImportModal";
import EventApplicationsView from "./EventApplicationsView/EventApplicationsView";
import { updateJobEventStatus } from "../../../../api/recruiter/jobEventService";

/**
 * JobFairJobDrive (Recruiter)
 *
 * Owns view-switching between 'list' and 'applications', and the
 * Add/Edit Event + Import modals. AddEventModal doubles as both
 * create and edit — passing `eventBeingEdited` as its `initialValues`
 * switches it into edit mode (see AddEventModal.jsx).
 *
 * refreshKey forces JobFairJobDriveList to refetch after any
 * create/edit/delete/status-change by remounting it.
 */
const JobFairJobDrive = () => {
  const [view, setView] = useState("list"); // 'list' | 'applications'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventBeingEdited, setEventBeingEdited] = useState(null);
  const [importEvent, setImportEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionError, setActionError] = useState("");

  const goToList = () => setView("list");
  const refresh = () => setRefreshKey((k) => k + 1);

  const handleOpenAddEvent = () => {
    setEventBeingEdited(null);
    setIsAddEventOpen(true);
  };

  const handleEditEvent = (event) => {
    setEventBeingEdited(event);
    setIsAddEventOpen(true);
  };

  const handleModalClose = () => {
    setIsAddEventOpen(false);
    setEventBeingEdited(null);
  };

  const handleModalSubmit = () => {
    setIsAddEventOpen(false);
    setEventBeingEdited(null);
    refresh();
  };

  const handleDeleteEvent = (eventId) => {
    // TODO: wire to a DELETE endpoint once available; refresh() afterward.
    refresh();
  };

  const handleStatusChange = async (eventId, nextStatus) => {
    setActionError("");
    try {
      await updateJobEventStatus(eventId, nextStatus);
      refresh();
    } catch (err) {
      console.error("Failed to update event status:", err);
      setActionError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update status.",
      );
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setView("applications");
  };

  if (view === "applications" && selectedEvent) {
    return <EventApplicationsView event={selectedEvent} onBack={goToList} />;
  }

  return (
    <>
      {actionError && (
        <div className="job-fair-job-drive__action-error" role="alert">
          {actionError}
          <button
            type="button"
            className="job-fair-job-drive__action-error-dismiss"
            onClick={() => setActionError("")}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <JobFairJobDriveList
        key={refreshKey}
        onAddEvent={handleOpenAddEvent}
        onImportEvent={setImportEvent}
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onStatusChange={handleStatusChange}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialValues={eventBeingEdited}
      />

      <ImportModal
        isOpen={Boolean(importEvent)}
        onClose={() => setImportEvent(null)}
        eventId={importEvent?.id}
        title={importEvent ? `Import - ${importEvent.name}` : "Import"}
        onImported={() => {
          setImportEvent(null);
          refresh();
        }}
      />
    </>
  );
};

export default JobFairJobDrive;
