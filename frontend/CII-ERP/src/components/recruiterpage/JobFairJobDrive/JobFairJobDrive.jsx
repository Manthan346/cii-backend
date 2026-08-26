import React, { useState } from 'react';
import JobFairJobDriveList from './JobFairJobDriveList/JobFairJobDriveList';
import AddEventModal from './AddEventModal/AddEventModal';
import ImportModal from '../shared/ImportModal/ImportModal';
import EventApplicationsView from './EventApplicationsView/EventApplicationsView';
import { placementEvents as initialEvents } from '../data';

/**
 * JobFairJobDrive (Recruiter)
 *
 * Owns the events list and switches between two views:
 *   - 'list'         -> JobFairJobDriveList (stat cards, filter bar, table)
 *   - 'applications' -> EventApplicationsView (that event's candidate
 *                       applications - this is what a row's "View" opens)
 *
 * "Add Events" opens AddEventModal as a popup over the list - a
 * single page-level action, so its open/closed state is a plain
 * boolean.
 *
 * "Import" is a per-row action instead (each row in EventTable has
 * its own Import button), so its state is which event's import is
 * open (`importEventId`, or null when closed) rather than a boolean -
 * that's also what lets ImportModal show the event's name in its title.
 *
 * A row's "Edit" also reopens AddEventModal (TODO: prefill once an
 * edit mode is built). A row's "Delete" removes that event from
 * state immediately. A row's Status pill (StatusSelect) lets the
 * recruiter set the event's status directly - handleStatusChange
 * just updates that one event's `status` field in place.
 */
const JobFairJobDrive = () => {
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState('list'); // 'list' | 'applications'
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [importEventId, setImportEventId] = useState(null);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
  const importEvent = events.find((event) => event.id === importEventId) ?? null;

  const goToList = () => setView('list');

  const handleAddEvent = (eventPayload) => {
    setEvents((prev) => [{ ...eventPayload, id: `event-${prev.length + 1}` }, ...prev]);
    setIsAddEventOpen(false);
  };

  const handleEditEvent = () => {
    // TODO: prefill AddEventModal with the selected event's data once an edit mode is built.
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const handleStatusChange = (eventId, nextStatus) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: nextStatus } : event)));
  };

  const handleViewEvent = (eventId) => {
    setSelectedEventId(eventId);
    setView('applications');
  };

  if (view === 'applications' && selectedEvent) {
    return <EventApplicationsView event={selectedEvent} onBack={goToList} />;
  }

  return (
    <>
      <JobFairJobDriveList
        events={events}
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
        title={importEvent ? `Import - ${importEvent.name}` : 'Import'}
      />
    </>
  );
};

export default JobFairJobDrive;
