import React, { useState } from "react";
import JobFairJobDriveList from "./JobFairJobDriveList/JobFairJobDriveList";
import AddEventModal from "./AddEventModal/AddEventModal";
import ImportModal from "../shared/ImportModal/ImportModal";
import EventApplicationsView from "./EventApplicationsView/EventApplicationsView";
import { updateJobEventStatus } from "../../../../api/recruiter/jobEventService";

const JobFairJobDrive = () => {
  const [view, setView] = useState("list");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [importEventId, setImportEventId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionError, setActionError] = useState("");

  const goToList = () => setView("list");
  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAddEvent = () => {
    setIsAddEventOpen(false);
    refresh();
  };

  const handleEditEvent = () => {
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
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

  const handleViewEvent = (eventId) => {
    setSelectedEventId(eventId);
    setView("applications");
  };

  const importEvent = importEventId ? { id: importEventId } : null;

  if (view === "applications" && selectedEventId) {
    return (
      <EventApplicationsView eventId={selectedEventId} onBack={goToList} />
    );
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
        onAddEvent={() => setIsAddEventOpen(true)}
        onImportEvent={setImportEventId}
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onStatusChange={handleStatusChange}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSubmit={handleAddEvent}
      />

      <ImportModal
        isOpen={Boolean(importEvent)}
        onClose={() => setImportEventId(null)}
        title={importEvent ? `Import - ${importEvent.id}` : "Import"}
      />
    </>
  );
};

export default JobFairJobDrive;
