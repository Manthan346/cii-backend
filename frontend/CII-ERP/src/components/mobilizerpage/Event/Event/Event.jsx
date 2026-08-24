import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import EventStats from '../EventStats/EventStats';
import EventFilterBar from '../EventFilterBar/EventFilterBar';
import EventTabs from '../EventTabs/EventTabs';
import EventList from '../EventList/EventList';
import AddEventModal from '../AddEventModal/AddEventModal';
import UploadMediaModal from '../UploadMediaModal/UploadMediaModal';
import { events as initialEvents } from '../../data/eventData';
import './Event.css';

export default function Event() {
  const [eventList, setEventList] = useState(initialEvents);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadEventId, setUploadEventId] = useState(null);

  const filteredEvents = useMemo(() => {
    let list = eventList;

    if (activeTab !== 'All') {
      list = list.filter((e) => e.status === activeTab);
    }
    if (typeFilter !== 'all') {
      list = list.filter((e) => e.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q));
    }

    return list;
  }, [eventList, activeTab, typeFilter, searchQuery]);

  const uploadEvent = eventList.find((e) => e.id === uploadEventId) || null;

  const handleCreateEvent = (form) => {
    const [month, day] = form.date
      ? [new Date(form.date).toLocaleDateString('en-GB', { month: 'short' }), new Date(form.date).getDate()]
      : ['—', '—'];

    const newEvent = {
      id: `ev-${Date.now()}`,
      title: form.eventName || 'Untitled Event',
      type: form.eventType || 'Seminar',
      day: String(day),
      month,
      time: '—',
      status: 'Upcoming',
    };
    setEventList((prev) => [newEvent, ...prev]);
    setAddModalOpen(false);
  };

  return (
    <div className="event-page">
      <div className="ev-header">
        <div className="ev-header__text">
          <h1 className="ev-header__title">Events</h1>
          <p className="ev-header__subtitle">
            Create and manage seminars, webinars, workshops, bootcamps, and guest visits
          </p>
        </div>
        <button type="button" className="ev-add-btn" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          Add New Event
        </button>
      </div>

      <EventStats />

      <EventFilterBar
        onSearch={setSearchQuery}
        onTypeChange={setTypeFilter}
        onExport={() => console.log('Export as...')}
      />

      <EventTabs activeTab={activeTab} onChange={setActiveTab} />

      <EventList events={filteredEvents} onUploadMedia={(e) => setUploadEventId(e.id)} />

      <AddEventModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleCreateEvent} />

      <UploadMediaModal
        event={uploadEvent}
        onClose={() => setUploadEventId(null)}
        onUpload={(event, payload) => {
          console.log('Upload media for', event.id, payload);
          setUploadEventId(null);
        }}
      />
    </div>
  );
}
