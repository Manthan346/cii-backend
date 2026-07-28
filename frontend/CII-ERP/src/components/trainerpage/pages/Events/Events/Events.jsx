import React, { useState } from "react";
import {
  Plus,
  Download,
  Printer,
} from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { Pagination } from "../../../shared";
import EventCard from "../EventCard/EventCard";
import EventFilterBar from "../EventFilterBar/EventFilterBar";
import EventTable from "../EventTable/EventTable";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import ViewEventModal from "../ViewEventModal/ViewEventModal";
import {
  upcomingEvents,
  eventTypeOptions,
  eventStatusOptions,
  eventModeOptions,
  eventMeta,
  eventRecords,
} from "../../../data";
import "../../../styles/variables.css";
import "./Events.css";
import styles from "./Events.module.css";

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
const Events = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [records, setRecords] = useState(eventRecords);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [eventBeingEdited, setEventBeingEdited] = useState(null);
  const [eventBeingViewed, setEventBeingViewed] = useState(null);

  const handleCreate = (formValues) => {
    setRecords((prev) => [
      {
        id: `evt-${Date.now()}`,
        title: formValues.title,
        type: formValues.type,
        mode: formValues.mode,
        date: formValues.date,
        time: formValues.time,
        venue: formValues.venue,
        batch: formValues.batch,
        organizer: "You",
        participants: 0,
        maxParticipants: Number(formValues.maxParticipants) || 0,
        status: "Upcoming",
        description: formValues.description,
      },
      ...prev,
    ]);
    setIsCreateOpen(false);
  };

  const handleUpdate = (formValues) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === eventBeingEdited.id
          ? {
              ...record,
              title: formValues.title,
              type: formValues.type,
              mode: formValues.mode,
              date: formValues.date || record.date,
              time: formValues.time,
              venue: formValues.venue,
              batch: formValues.batch,
              maxParticipants: Number(formValues.maxParticipants) || record.maxParticipants,
              description: formValues.description,
            }
          : record
      )
    );
    setEventBeingEdited(null);
  };

  const handleDelete = (record) => {
    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className={styles.content}>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.title}>Events</h1>
                  <p className={styles.subtitle}>{eventMeta.subtitle}</p>
                </div>
                <button type="button" className={styles.createBtn} onClick={() => setIsCreateOpen(true)}>
                  <Plus size={16} />
                  <span>Create Event</span>
                </button>
              </div>

              <section className={styles.upcomingSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Upcoming events</h2>
                </div>
                <div className={styles.upcomingGrid}>
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      type={event.type}
                      date={event.date}
                      time={event.time}
                      venue={event.venue}
                      tone={event.tone}
                      onClick={() => {
                        const fullRecord = records.find((record) => record.id === event.id);
                        if (fullRecord) setEventBeingViewed(fullRecord);
                      }}
                    />
                  ))}
                </div>
              </section>

              <EventFilterBar typeOptions={eventTypeOptions} statusOptions={eventStatusOptions} />

              <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                  <h2 className={styles.tableTitle}>All Events</h2>
                  <div className={styles.tableActions}>
                    <button type="button" className={styles.iconBtn} aria-label="Download list">
                      <Download size={16} />
                    </button>
                    <button type="button" className={styles.iconBtn} aria-label="Print list">
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
                  total={eventMeta.totalEvents}
                  currentPage={currentPage}
                  totalPages={eventMeta.totalPages}
                  onPageChange={setCurrentPage}
                  label={`Showing 1-${records.length} out of ${eventMeta.totalEvents}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {isCreateOpen && (
        <CreateEventModal
          typeOptions={eventTypeOptions.filter((option) => !option.toLowerCase().startsWith("all"))}
          modeOptions={eventModeOptions}
          onCancel={() => setIsCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      {eventBeingEdited && (
        <CreateEventModal
          typeOptions={eventTypeOptions.filter((option) => !option.toLowerCase().startsWith("all"))}
          modeOptions={eventModeOptions}
          initialValues={eventBeingEdited}
          onCancel={() => setEventBeingEdited(null)}
          onSave={handleUpdate}
        />
      )}

      {eventBeingViewed && (
        <ViewEventModal event={eventBeingViewed} onClose={() => setEventBeingViewed(null)} />
      )}
    </div>
  );
};

export default Events;
