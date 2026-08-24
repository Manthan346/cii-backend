import React, { useMemo, useState } from 'react';
import PlacementEventStats from '../PlacementEventStats/PlacementEventStats';
import PlacementEventFilterBar from '../PlacementEventFilterBar/PlacementEventFilterBar';
import ViewToggle from '../ViewToggle/ViewToggle';
import EventCard from '../EventCard/EventCard';
import EventListView from '../EventListView/EventListView';
import EventDetailModal from '../EventDetailModal/EventDetailModal';
import UploadMediaModal from '../UploadMediaModal/UploadMediaModal';
import { placementEvents } from '../../../data/placementEventData';
import './PlacementEvent.css';

export default function PlacementEvent() {
  const [view, setView] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailEventId, setDetailEventId] = useState(null);
  const [uploadEventId, setUploadEventId] = useState(null);

  const filteredEvents = useMemo(() => {
    let list = placementEvents;
    if (statusFilter !== 'all') {
      list = list.filter((e) => e.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    return list;
  }, [statusFilter, searchQuery]);

  const detailEvent = placementEvents.find((e) => e.id === detailEventId) || null;
  const uploadEvent = placementEvents.find((e) => e.id === uploadEventId) || null;

  // "Add Images & video" inside the detail modal hands off to the same
  // upload modal — close one, open the other, rather than stacking them.
  const handleOpenUploadFromDetail = (event) => {
    setDetailEventId(null);
    setUploadEventId(event.id);
  };

  const handleUploadSubmit = (event, payload) => {
    console.log('Upload media for', event.id, payload);
    setUploadEventId(null);
  };

  return (
    <div className="placement-event-page">
      <div className="pe-header">
        <h1 className="pe-header__title">Placement Events</h1>
        <p className="pe-header__subtitle">All job fair events — upcoming, today, and completed</p>
      </div>

      <PlacementEventStats />

      <PlacementEventFilterBar
        onSearch={setSearchQuery}
        onStatusChange={setStatusFilter}
        onApply={() => console.log('Apply filter', { searchQuery, statusFilter })}
      />

      <ViewToggle view={view} onChange={setView} />

      {view === 'card' ? (
        <div className="pe-cards-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpenWorkspace={(e) => setDetailEventId(e.id)}
              onUploadMedia={(e) => setUploadEventId(e.id)}
            />
          ))}
        </div>
      ) : (
        <EventListView
          events={filteredEvents}
          onOpenWorkspace={(e) => setDetailEventId(e.id)}
          onUploadMedia={(e) => setUploadEventId(e.id)}
        />
      )}

      <EventDetailModal
        event={detailEvent}
        onClose={() => setDetailEventId(null)}
        onOpenUpload={handleOpenUploadFromDetail}
      />

      <UploadMediaModal
        event={uploadEvent}
        onClose={() => setUploadEventId(null)}
        onUpload={handleUploadSubmit}
      />
    </div>
  );
}
