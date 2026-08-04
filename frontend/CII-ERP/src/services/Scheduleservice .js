// scheduleService.js
// Data layer for the Upcoming Classes (Schedule Dashboard) page.
//
// LIVE: everything below is derived from GET /candidate/candidate-sessions,
// reshaped client-side into the exact statistics/weekData/scheduleDays
// shapes WeekSelector/ScheduleList/StatCard already expect — no child
// component needed to change.
//
// STATIC (not backend-driven): etiquette tips — fixed copy, not
// candidate-specific, so it stays a local constant here instead of an
// API call.

import API from "../../api/api"; // ⚠️ adjust if your axios instance lives elsewhere
import { formatSessionTime } from "./scheduleTimeFormatter.js";

// GET /candidate/candidate-sessions
// ⚠️ The backend currently returns EVERY session for the candidate's
// enrolled batches — past, present, future — since its session_date
// filter is commented out. All "this window" scoping below happens
// client-side. Worth asking backend to bound this query eventually
// (e.g. session_date >= a few weeks ago) so the payload doesn't grow
// unbounded over a candidate's enrollment.
async function fetchSessionsRaw() {
  const res = await API.get("/candidate/candidate-sessions");
  return res.data.data.sessions; // [{ session_id, batch_name, session_date, session_time, topic_name, room_no, attendance_mode, instructor }]
}

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_ABBR = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// Reads calendar date parts directly out of the string instead of
// `new Date(isoString)`, to avoid local-timezone shifting a UTC
// midnight timestamp back/forward a day.
function parseDateOnly(isoDateLike) {
  const datePart = String(isoDateLike).slice(0, 10); // "YYYY-MM-DD"
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d); // local date, no TZ conversion
}

function toDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Unique id per calendar day (month included, since a rolling 7-day
// window can cross a month boundary — e.g. 25 Jul → 1 Aug — and two
// different months can share the same date-of-month number).
function dayId(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function toModeLabel(mode) {
  const lower = String(mode || "").toLowerCase();
  if (lower === "online") return "Online";
  if (lower === "offline") return "Offline";
  if (lower === "hybrid") return "Hybrid";
  return mode || "Online";
}

// Builds everything the page needs for a *rolling* 7-day window starting
// at `referenceDate` (defaults to today) and running forward 6 more days.
// This intentionally does NOT snap to a calendar Sun–Sat week — today is
// always the first card, and the window rolls across month boundaries
// (e.g. today Sat 25 Jul → 25, 26, 27, 28, 29, 30, 31 Jul; today Sat 30 Jul
// → 30, 31 Jul, 1, 2, 3, 4, 5 Aug). Pass a different referenceDate later
// if you add "view next window" navigation.
export async function fetchScheduleData(referenceDate = new Date()) {
  const sessions = await fetchSessionsRaw();

  const today = toDateOnly(referenceDate);
  const windowStart = today;
  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowEnd.getDate() + 6);

  const windowSessions = sessions.filter((s) => {
    const d = parseDateOnly(s.session_date);
    return d >= windowStart && d <= windowEnd;
  });

  // ---- weekData: one entry per day of the rolling window, today first ----
  const weekData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(windowStart);
    d.setDate(d.getDate() + i);
    const count = windowSessions.filter(
      (s) => parseDateOnly(s.session_date).getTime() === d.getTime(),
    ).length;
    weekData.push({
      id: dayId(d),
      day: DAY_ABBR[d.getDay()],
      date: d.getDate(),
      month: MONTH_ABBR[d.getMonth()], // exposed in case the card wants to
      // show it when the window crosses into a new month
      classCount: count,
    });
  }

  // today is always weekData[0] since the window starts at today — this
  // stays a fixed, explicit anchor (rather than relying on index 0
  // implicitly) so downstream code reads clearly and stays correct even
  // if the window logic changes later.
  const todayId = dayId(today);

  // Default selection: today (always present, it's the first day of the
  // window) unless a fallback is ever needed.
  const todayEntry = weekData.find((d) => d.id === todayId);
  const firstWithClasses = weekData.find((d) => d.classCount > 0);
  const defaultSelectedDayId = (todayEntry ?? firstWithClasses ?? weekData[0])
    .id;

  // ---- statistics: counted over the displayed window ----
  const onlineCount = windowSessions.filter(
    (s) => String(s.attendance_mode || "").toLowerCase() === "online",
  ).length;
  const offlineCount = windowSessions.length - onlineCount;

  const statistics = [
    {
      id: "stat-classes",
      icon: "upcomingClasses",
      label: "Classes this week",
      value: String(windowSessions.length),
      iconBg: "#DCFCE7",
      iconColor: "#16A34A",
    },
    {
      id: "stat-online",
      icon: "wifi",
      label: "Online sessions",
      value: String(onlineCount),
      iconBg: "#FEE2E2",
      iconColor: "#EF4444",
    },
    {
      id: "stat-campus",
      icon: "home",
      label: "On-campus sessions",
      value: String(offlineCount),
      iconBg: "#EDE9FE",
      iconColor: "#7C3AED",
    },
    // "Today's hours" dropped on purpose — no session duration/end-time
    // in the backend response to compute it from.
  ];

  // ---- scheduleDays: one group per date, all its classes underneath ----
  const byDate = new Map();
  for (const s of windowSessions) {
    const d = parseDateOnly(s.session_date);
    const key = dayId(d);
    if (!byDate.has(key)) byDate.set(key, { date: d, sessions: [] });
    byDate.get(key).sessions.push(s);
  }

  const scheduleDays = Array.from(byDate.entries()).map(
    ([weekDayId, { date, sessions: daySessions }]) => {
      const isToday = date.getTime() === today.getTime();
      return {
        id: `day-${weekDayId}`,
        weekDayId,
        label: isToday ? "TODAY" : DAY_ABBR[date.getDay()],
        dateLabel: `${date.getDate()} ${MONTH_ABBR[date.getMonth()]}`,
        classes: daySessions.map((s) => {
          const { time, period } = formatSessionTime(s.session_time);
          const modeLabel = toModeLabel(s.attendance_mode);
          return {
            id: String(s.session_id),
            time,
            period,
            title: s.topic_name,
            subject: s.batch_name,
            mode: modeLabel,
            location: modeLabel === "Online" ? null : s.room_no,
            mentor: s.instructor,
            // Backend doesn't expose a session status yet (upcoming/
            // completed/missed) — everything renders as "upcoming" until
            // it does.
            status: "upcoming",
          };
        }),
      };
    },
  );

  return { statistics, weekData, scheduleDays, defaultSelectedDayId, todayId };
}

// ────────────────────────────────────────────────────────────
// Static — not backend-driven
// ────────────────────────────────────────────────────────────

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