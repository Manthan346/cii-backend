// Dummy data for the Events page.
// Replace with API responses later, e.g.
//   GET /api/events/stats        -> eventStats
//   GET /api/events/upcoming     -> upcomingEvents
//   GET /api/events?page=1       -> eventRecords

// ---- Summary cards: Total events / Upcoming / Total participants / Completed ----
export const eventStats = [
  {
    id: "total",
    label: "Total events",
    value: 12,
    icon: "grid",
    tone: "blue",
  },
  {
    id: "upcoming",
    label: "Upcoming events",
    value: 4,
    icon: "calendar",
    tone: "orange",
  },
  {
    id: "participants",
    label: "Total participants",
    value: 386,
    icon: "users",
    tone: "green",
  },
  {
    id: "completed",
    label: "Completed",
    value: 7,
    icon: "check",
    tone: "grey",
  },
];

// ---- "Upcoming events" highlight tiles (top 3 nearest events) ----
export const upcomingEvents = [
  {
    id: "evt-101",
    title: "AI in Industry - Seminar",
    type: "Seminar",
    date: "02 Aug 2026",
    time: "10:00 AM - 12:00 PM",
    venue: "CII Auditorium, Mumbai",
    tone: "teal",
  },
  {
    id: "evt-102",
    title: "Advanced Python Workshop",
    type: "Workshop",
    date: "06 Aug 2026",
    time: "02:00 PM - 05:00 PM",
    venue: "Online - Zoom",
    tone: "blue",
  },
  {
    id: "evt-103",
    title: "Data Science Career Webinar",
    type: "Webinar",
    date: "10 Aug 2026",
    time: "04:00 PM - 05:00 PM",
    venue: "Online - MS Teams",
    tone: "mint",
  },
];

// ---- Filter bar dropdown options (Type / Status) ----
export const eventTypeOptions = [
  "All types",
  "Seminar",
  "Workshop",
  "Webinar",
  "Upskilling",
];

export const eventStatusOptions = [
  "All status",
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled",
];

// ---- Add/Edit event form dropdown options ----
export const eventModeOptions = ["Offline", "Online", "Hybrid"];

// ---- Page-level meta (subtitle, table caption, pagination) ----
export const eventMeta = {
  subtitle:
    "Organize and track seminars, workshops and other trainer-led events",
  totalEvents: 12,
  totalPages: 4,
};

// ---- "All Events" table rows ----
export const eventRecords = [
  {
    id: "evt-101",
    title: "AI in Industry - Seminar",
    type: "Seminar",
    mode: "Offline",
    date: "02 Aug 2026",
    time: "10:00 AM - 12:00 PM",
    venue: "CII Auditorium, Mumbai",
    batch: "DS-24",
    organizer: "Rohit Mehta",
    participants: 82,
    maxParticipants: 100,
    status: "Upcoming",
    description:
      "A seminar exploring how artificial intelligence is reshaping manufacturing, retail and healthcare, with live case studies from industry partners.",
  },
  {
    id: "evt-102",
    title: "Advanced Python Workshop",
    type: "Workshop",
    mode: "Online",
    date: "06 Aug 2026",
    time: "02:00 PM - 05:00 PM",
    venue: "Online - Zoom",
    batch: "PY-18",
    organizer: "Anjali Rane",
    participants: 46,
    maxParticipants: 60,
    status: "Upcoming",
    description:
      "Hands-on workshop covering decorators, generators, async IO and packaging best practices for intermediate Python learners.",
  },
  {
    id: "evt-103",
    title: "Data Science Career Webinar",
    type: "Webinar",
    mode: "Online",
    date: "10 Aug 2026",
    time: "04:00 PM - 05:00 PM",
    venue: "Online - MS Teams",
    batch: "DS-24",
    organizer: "Karan Bhosale",
    participants: 120,
    maxParticipants: 150,
    status: "Upcoming",
    description:
      "Panel discussion with hiring managers on breaking into data science roles, resume reviews and interview preparation tips.",
  },
  {
    id: "evt-104",
    title: "SQL Essentials Bootcamp",
    type: "Workshop",
    mode: "Offline",
    date: "18 Jul 2026",
    time: "11:00 AM - 01:00 PM",
    venue: "CII Training Hall 2, Mumbai",
    batch: "SQL-20",
    organizer: "Neha Wagh",
    participants: 38,
    maxParticipants: 40,
    status: "Completed",
    description:
      "Two-hour crash course on joins, window functions and query optimisation for the SQL-20 batch.",
  },
  {
    id: "evt-105",
    title: "Business Communication Meetup",
    type: "Meetup",
    mode: "Offline",
    date: "12 Jul 2026",
    time: "03:00 PM - 04:30 PM",
    venue: "CII Auditorium, Mumbai",
    batch: "All Batches",
    organizer: "Rohit Mehta",
    participants: 54,
    maxParticipants: 80,
    status: "Completed",
    description:
      "Informal meetup with roleplay exercises on client communication and email etiquette.",
  },
  {
    id: "evt-106",
    title: "Cloud Computing Conference",
    type: "Conference",
    mode: "Hybrid",
    date: "25 Jun 2026",
    time: "09:30 AM - 04:00 PM",
    venue: "CII Auditorium + Online",
    batch: "All Batches",
    organizer: "Suresh Iyer",
    participants: 210,
    maxParticipants: 250,
    status: "Cancelled",
    description:
      "Full-day conference on cloud fundamentals; postponed due to venue unavailability.",
  },
];
