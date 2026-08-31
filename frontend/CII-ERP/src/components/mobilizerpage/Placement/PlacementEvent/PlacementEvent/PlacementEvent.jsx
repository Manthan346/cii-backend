import React, { useEffect, useState } from "react";
import PlacementEventStats from "../PlacementEventStats/PlacementEventStats";
import PlacementEventFilterBar from "../PlacementEventFilterBar/PlacementEventFilterBar";
import ViewToggle from "../ViewToggle/ViewToggle";
import EventCard from "../EventCard/EventCard";
import EventListView from "../EventListView/EventListView";
import EventDetailModal from "../EventDetailModal/EventDetailModal";
import UploadMediaModal from "../UploadMediaModal/UploadMediaModal";
import {
  fetchJobEventDetails,
  fetchJobEvents,
  uploadJobEventImages,
} from "../../../../../../api/mobilizer/placementEventsService";
import "./PlacementEvent.css";

export default function PlacementEvent() {
  const [view, setView] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadEventId, setUploadEventId] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    fetchJobEvents({
      page,
      limit: 20,
      sort_order: "desc",
      search: searchQuery.trim() || undefined,
      event_type: eventType || undefined,
      event_status: statusFilter || undefined,
      date: dateFilter || undefined,
    })
      .then(({ events: jobEvents, pagination }) => {
        if (!isMounted) return;
        setEvents(jobEvents);
        setTotalPages(Math.max(1, pagination.totalPages));
        setTotalRecords(pagination.totalRecords);
      })
      .catch(() => {
        if (isMounted) setError("Unable to load job events");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [dateFilter, eventType, page, searchQuery, statusFilter]);

  const uploadEvent = events.find((e) => e.id === uploadEventId) || null;

  const handleViewEvent = async (event) => {
    try {
      setDetailEvent(await fetchJobEventDetails(event.id));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load event details",
      );
    }
  };

  const handleUploadSubmit = async (event, files) => {
    await uploadJobEventImages(event.id, files);
    setUploadEventId(null);
  };

  const handleOpenMap = (event) => {
    const address = event.address || event.venue;
    if (!address || address === "-") return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="placement-event-page">
      <div className="pe-header">
        <h1 className="pe-header__title">Placement Events</h1>
        <p className="pe-header__subtitle">
          All job fair events — upcoming, today, and completed
        </p>
      </div>

      <PlacementEventStats />

      <PlacementEventFilterBar
        onSearch={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onTypeChange={(value) => {
          setEventType(value === "all" ? "" : value);
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
        onApply={() => setPage(1)}
      />

      <ViewToggle view={view} onChange={setView} />

      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading job events...</p>
      ) : view === "card" ? (
        <div className="pe-cards-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewEvent={handleViewEvent}
              onOpenMap={handleOpenMap}
              onUploadMedia={(e) => setUploadEventId(e.id)}
            />
          ))}
        </div>
      ) : (
        <EventListView
          events={events}
          pagination={{
            page,
            totalPages,
            totalRecords,
            onPrev: () => setPage((value) => Math.max(1, value - 1)),
            onNext: () => setPage((value) => Math.min(totalPages, value + 1)),
          }}
          onViewEvent={handleViewEvent}
          onOpenMap={handleOpenMap}
          onUploadMedia={(e) => setUploadEventId(e.id)}
        />
      )}

      <EventDetailModal
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onOpenUpload={(event) => setUploadEventId(event.id)}
      />

      <UploadMediaModal
        event={uploadEvent}
        onClose={() => setUploadEventId(null)}
        onUpload={handleUploadSubmit}
      />
    </div>
  );
}
