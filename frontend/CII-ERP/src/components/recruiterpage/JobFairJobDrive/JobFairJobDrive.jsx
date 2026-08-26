import React, { useState } from 'react';
import JobFairJobDriveList from './JobFairJobDriveList/JobFairJobDriveList';
import AddEventModal from './AddEventModal/AddEventModal';
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
 * "Add Events" opens AddEventModal as a popup over the list. A row's
 * "Edit" also reopens AddEventModal (TODO: prefill once an edit mode
 * is built). A row's "Delete" removes that event from state
 * immediately.
 */
const JobFairJobDrive = () => {
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState('list'); // 'list' | 'applications'
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;

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
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSubmit={handleAddEvent}
      />
    </>
  );
};

export default JobFairJobDrive;
