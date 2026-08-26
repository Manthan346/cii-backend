import { useEffect, useMemo, useState } from "react";
import {
  fetchInstructorEvents,
  mapEventRecord,
  createEvent,
  updateEvent,
} from "../../../../../../api/trainer/eventService";
import { Plus, Download, Printer } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { Pagination } from "../../../shared";
import EventCard from "../EventCard/EventCard";
import EventFilterBar from "../EventFilterBar/EventFilterBar";
import EventTable from "../EventTable/EventTable";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import ViewEventModal from "../ViewEventModal/ViewEventModal";
import {
  eventTypeOptions,
  eventStatusOptions,
  eventModeOptions,
  eventMeta,
  // eventRecords,
} from "../../../data";
import "../../../styles/variables.css";
import "./Events.css";
import "./Events.css";

/**
 * Events
 *
 * Trainer "Events" page, sits in the sidebar's WORK section right next
 * to Work and Task Assigned. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other trainer page) around the
 * events-specific content: an "Upcoming events" highlight row, a
 * Search/Type/Status filter bar, the "All Events" table, and a
 * pagination footer.
 *
 * Lets the trainer organize seminars, workshops, webinars, conferences
 * or meetups: "+ Create Event" opens CreateEventModal to add a new
 * one, the table's row actions open CreateEventModal pre-filled (edit),
 * ViewEventModal (view), or remove the row (delete).
 */

// Formats a raw ISO date string (e.g. from event_date) to "15 Sep 2026"
function formatEventDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Formats a raw ISO time string (e.g. from event_time) to "08:30 AM"
function formatEventTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchInstructorEvents({ page: currentPage, limit: 6 })
      .then((data) => {
        if (cancelled) return;
        setRecords((data.events ?? []).map(mapEventRecord));
        setPagination({
          totalRecords: data.pagination?.totalRecords ?? 0,
          totalPages: data.pagination?.totalPages ?? 1,
        });
      })
      .catch(() => !cancelled && setRecords([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [eventBeingEdited, setEventBeingEdited] = useState(null);
  const [eventBeingViewed, setEventBeingViewed] = useState(null);

  const CARD_TONES = ["teal", "blue", "mint"];

  const upcomingHighlights = useMemo(() => {
    return records
      .filter((r) => r.status?.toLowerCase() === "upcoming")
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
      .map((r, i) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        date: r.date,
        time: r.time,
        venue: r.venue,
        tone: CARD_TONES[i % CARD_TONES.length],
      }));
  }, [records]);

  const handleCreate = async (formValues) => {
    try {
      await createEvent(formValues);
      setIsCreateOpen(false);
      // Refetch the current page so the new event shows up for real
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to create event:", err);
      // TODO: surface a real error message in the modal
    }
  };

  const handleUpdate = async (formValues) => {
    try {
      await updateEvent(eventBeingEdited.id, formValues);
      setEventBeingEdited(null);
      setCurrentPage(1); // triggers the existing fetch effect to refresh
    } catch (err) {
      console.error("Failed to update event:", err);
      // TODO: surface a real error message in the modal
    }
  };

  const handleDelete = (record) => {
    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };
  return (
    <div className="staff-dashboard">
      <Topbar
        user={{
          name: "Staff Admin",
        }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className={"events-content"}>
              <div className={"events-page-header"}>
                <div>
                  <h1 className={"events-title"}>Events</h1>
                  <p className={"events-subtitle"}>{eventMeta.subtitle}</p>
                </div>
                <button
                  type="button"
                  className={"events-create-btn"}
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus size={16} />
                  <span>Create Event</span>
                </button>
              </div>

              <section className={"events-upcoming-section"}>
                <div className={"events-section-header"}>
                  <h2 className={"events-section-title"}>Upcoming events</h2>
                </div>
                <div className={"events-upcoming-grid"}>
                  {upcomingHighlights.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      type={event.type}
                      date={formatEventDate(event.date)}
                      time={formatEventTime(event.time)}
                      venue={event.venue}
                      batch={event.batch}
                      tone={event.tone}
                      onClick={() => {
                        const fullRecord = records.find(
                          (record) => record.id === event.id,
                        );
                        if (fullRecord) setEventBeingViewed(fullRecord);
                      }}
                    />
                  ))}
                </div>
              </section>

              <EventFilterBar
                typeOptions={eventTypeOptions}
                statusOptions={eventStatusOptions}
              />

              <section className={"events-table-section"}>
                <div className={"events-table-header"}>
                  <h2 className={"events-table-title"}>All Events</h2>
                  <div className={"events-table-actions"}>
                    <button
                      type="button"
                      className={"events-icon-btn"}
                      aria-label="Download list"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      className={"events-icon-btn"}
                      aria-label="Print list"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                <EventTable
                  records={records}
                  onView={setEventBeingViewed}
                  onEdit={setEventBeingEdited}
                  onDelete={handleDelete}
                />

                <Pagination
                  showing={records.length}
                  total={pagination.totalRecords}
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={6}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {isCreateOpen && (
        <CreateEventModal
          typeOptions={eventTypeOptions.filter(
            (option) => !option.toLowerCase().startsWith("all"),
          )}
          modeOptions={eventModeOptions}
          onCancel={() => setIsCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      {eventBeingEdited && (
        <CreateEventModal
          typeOptions={eventTypeOptions.filter(
            (option) => !option.toLowerCase().startsWith("all"),
          )}
          modeOptions={eventModeOptions}
          initialValues={eventBeingEdited}
          onCancel={() => setEventBeingEdited(null)}
          onSave={handleUpdate}
        />
      )}

      {eventBeingViewed && (
        <ViewEventModal
          event={eventBeingViewed}
          onClose={() => setEventBeingViewed(null)}
        />
      )}
    </div>
  );
};
export default Events;
