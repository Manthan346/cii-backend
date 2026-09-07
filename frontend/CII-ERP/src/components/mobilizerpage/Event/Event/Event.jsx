import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import EventStats from "../EventStats/EventStats";
import EventFilterBar from "../EventFilterBar/EventFilterBar";
import EventTabs from "../EventTabs/EventTabs";
import EventList from "../EventList/EventList";
import AddEventModal from "../AddEventModal/AddEventModal";
import UploadMediaModal from "../UploadMediaModal/UploadMediaModal";
import EventDetailsModal from "../EventDetailsModal/EventDetailsModal";
import {
  fetchCenterEvents,
  fetchEventDetails,
  createPublicEvent,
  updatePublicEvent,
  uploadEventImages,
} from "../../../../../api/mobilizer/eventService";
import { fetchMobilizerProfile } from "../../../../../api/mobilizer/profileService";
import "./Event.css";

export default function Event() {
  const [eventList, setEventList] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploadEventId, setUploadEventId] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [mobilizerName, setMobilizerName] = useState("Mobilizer");

  useEffect(() => {
    fetchMobilizerProfile()
      .then((response) => {
        const profile = response.data?.data?.profile;
        const name =
          profile?.name ||
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
        if (name) setMobilizerName(name);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    const status = activeTab === "All" ? statusFilter : activeTab.toUpperCase();
    fetchCenterEvents({
      page,
      limit: 20,
      title: searchQuery.trim() || undefined,
      event_type: typeFilter || undefined,
      status: status || undefined,
      date: dateFilter || undefined,
    })
      .then(({ events, pagination }) => {
        if (!isMounted) return;
        setEventList(events);
        setTotalPages(Math.max(1, pagination.totalPages));
        setTotalRecords(pagination.totalRecords);
      })
      .catch(() => {
        if (isMounted) setError("Unable to load events");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [
    activeTab,
    dateFilter,
    page,
    refreshKey,
    searchQuery,
    statusFilter,
    typeFilter,
  ]);

  const uploadEvent =
    eventList.find((event) => event.id === uploadEventId) || null;

  const handleSaveEvent = async (form) => {
    try {
      const savedEvent = editingEvent
        ? await updatePublicEvent(editingEvent.id, form)
        : await createPublicEvent(form);
      if (editingEvent && savedEvent) {
        setEventList((currentEvents) =>
          currentEvents.map((event) =>
            event.id === editingEvent.id
              ? {
                  ...event,
                  ...savedEvent,
                  event_status: form.eventStatus,
                  status: form.eventStatus
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (letter) => letter.toUpperCase()),
                }
              : event,
          ),
        );
      }
      setAddModalOpen(false);
      setEditingEvent(null);
      if (!editingEvent) {
        setPage(1);
        setRefreshKey((value) => value + 1);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save event");
    }
  };

  const handleViewEvent = async (event) => {
    try {
      setDetailEvent(await fetchEventDetails(event.id));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load event details",
      );
    }
  };

  const handleUpload = async (event, files) => {
    await uploadEventImages(event.id, files);
    setAddModalOpen(false);
    setUploadEventId(null);
  };

  return (
    <div className="event-page">
      <div className="ev-header">
        <div className="ev-header__text">
          <h1 className="ev-header__title">Events</h1>
          <p className="ev-header__subtitle">
            Create and manage seminars, webinars, workshops, bootcamps, and
            guest visits
          </p>
        </div>
        <button
          type="button"
          className="ev-add-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={16} />
          Add New Event
        </button>
      </div>

      <EventStats />

      <EventFilterBar
        onSearch={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onTypeChange={(value) => {
          setTypeFilter(value === "all" ? "" : value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value === "all" ? "" : value);
          setPage(1);
        }}
        onDateChange={(value) => {
          setDateFilter(value);
          setPage(1);
        }}
      />

      <EventTabs
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setStatusFilter("");
          setPage(1);
        }}
      />

      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <EventList
          events={eventList}
          onViewEvent={handleViewEvent}
          onUploadMedia={(event) => setUploadEventId(event.id)}
          pagination={{
            page,
            totalPages,
            totalRecords,
            onPrev: () => setPage((value) => Math.max(1, value - 1)),
            onNext: () => setPage((value) => Math.min(totalPages, value + 1)),
          }}
        />
      )}

      <AddEventModal
        event={editingEvent}
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSaveEvent}
      />

      <UploadMediaModal
        event={uploadEvent}
        onClose={() => setUploadEventId(null)}
        onUpload={handleUpload}
      />
      <EventDetailsModal
        event={detailEvent}
        creatorName={mobilizerName}
        onClose={() => setDetailEvent(null)}
        onEdit={(event) => {
          setDetailEvent(null);
          setEditingEvent(event);
          setAddModalOpen(true);
        }}
      />
    </div>
  );
}
