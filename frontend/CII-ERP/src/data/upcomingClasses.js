// src/data/upcomingClasses.js
//
// Mock data for the Upcoming Classes (Schedule Dashboard) page.
//
// BACKEND INTEGRATION NOTE:
// Each exported array below is shaped exactly like the payload the real
// endpoints should return. When the Node.js + SQL backend is ready, replace
// the static arrays with API calls, e.g.:
//
//   const statistics   = await api.get("/schedule/statistics");
//   const weekData     = await api.get("/schedule/week?weekOf=2026-06-21");
//   const scheduleDays = await api.get("/schedule/classes?weekOf=2026-06-21");
//   const etiquette    = await api.get("/schedule/etiquette");
//
// No component prop shapes need to change — only where the data comes from.

// ---- Statistics cards ------------------------------------------------
// `icon` must be one of the string keys in shared/Icon/Icon.jsx's PATHS map.
// There's no dedicated "video" or "building" glyph in Icon.jsx yet, so
// "wifi" (online/connectivity) and "home" (campus) are used as the closest
// visual stand-ins below — swap these for dedicated icons any time by
// adding new paths to Icon.jsx and updating the strings here.
export const statistics = [
  {
    id: "stat-classes",
    icon: "upcomingClasses",
    label: "Classes this week",
    value: "4",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "stat-online",
    icon: "wifi",
    label: "Online sessions",
    value: "4",
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
  },
  {
    id: "stat-campus",
    icon: "home",
    label: "On-campus sessions",
    value: "2",
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  {
    id: "stat-hours",
    icon: "clock",
    label: "Today's hours",
    value: "4h",
    iconBg: "#FFEDD5",
    iconColor: "#F97316",
  },
];

// ---- Week calendar strip ----------------------------------------------
export const weekData = [
  { id: "sun-21", day: "SUN", date: 21, classCount: 0 },
  { id: "mon-22", day: "MON", date: 22, classCount: 1 },
  { id: "tue-23", day: "TUE", date: 23, classCount: 2 },
  { id: "wed-24", day: "WED", date: 24, classCount: 1 },
  { id: "thu-25", day: "THU", date: 25, classCount: 1 },
  { id: "fri-26", day: "FRI", date: 26, classCount: 1 },
  { id: "sat-27", day: "SAT", date: 27, classCount: 0 },
];

export const defaultSelectedDayId = "tue-23";

// ---- Today's / upcoming schedule ---------------------------------------
// Grouped by day so ScheduleList can render a heading per group and map
// ScheduleCard for every class underneath it.
export const scheduleDays = [
  {
    id: "day-tue-23",
    weekDayId: "tue-23",
    label: "TODAY",
    dateLabel: "TUE, 23 JUN",
    classes: [
      {
        id: "class-1",
        time: "2:00",
        period: "PM",
        title: "Python Lab Session",
        subject: "Python for Data Analysis",
        mode: "Online",
        location: null,
        mentor: "S.Iyer",
        status: "upcoming",
      },
      {
        id: "class-2",
        time: "4:00",
        period: "PM",
        title: "Data Visualization",
        subject: "Data Science Fundamentals",
        mode: "Offline",
        location: "Room No 204",
        mentor: "R.Mehta",
        status: "upcoming",
      },
    ],
  },
  {
    id: "day-fri-26-a",
    weekDayId: "fri-26",
    label: "FRI",
    dateLabel: "26 JUN",
    classes: [
      {
        id: "class-3",
        time: "2:00",
        period: "PM",
        title: "Communication Skills",
        subject: "Business Communication",
        mode: "Online",
        location: null,
        mentor: "S.Iyer",
        status: "upcoming",
      },
    ],
  },
  {
    id: "day-fri-26-b",
    weekDayId: "fri-26",
    label: "FRI",
    dateLabel: "26 JUN",
    classes: [
      {
        id: "class-4",
        time: "2:00",
        period: "PM",
        title: "Communication Skills",
        subject: "Business Communication",
        mode: "Hybrid",
        location: "Room No 106",
        mentor: "S.Iyer",
        status: "upcoming",
      },
    ],
  },
];

// ---- Class etiquette panel ---------------------------------------------
export const etiquetteIconKeys = {
  LIGHTBULB: "lightbulb",
  MUTE: "mute",
  ATTENDANCE: "attendance",
};

export const etiquette = [
  {
    id: "etiquette-1",
    iconKey: etiquetteIconKeys.LIGHTBULB,
    iconColor: "#F97316",
    backgroundColor: "#FFEDD5",
    text: "Join online sessions 5 minutes early to test your camera and mic.",
  },
  {
    id: "etiquette-2",
    iconKey: etiquetteIconKeys.MUTE,
    iconColor: "#EF4444",
    backgroundColor: "#FEE2E2",
    text: "Stay muted unless speaking to keep the session clear for everyone.",
  },
  {
    id: "etiquette-3",
    iconKey: etiquetteIconKeys.ATTENDANCE,
    iconColor: "#16A34A",
    backgroundColor: "#DCFCE7",
    text: "Attendance is marked automatically when you join on time.",
  },
];
