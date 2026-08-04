// AttendanceCalendar.jsx
// Month-view calendar showing per-day attendance status.
//
// Props:
//   monthLabel  {string}    – e.g. "July 2026"
//   year        {number}
//   month       {number}    – 1-12
//   days        {Array|null} – [{ date: number, status: 'present'|'absent'|'late'|'holiday' }]
//                               Pass `null` (not []) when no course is
//                               selected yet — the backend can't build
//                               a day grid without one, so this renders
//                               a placeholder instead of a misleading
//                               empty grid. Pass [] for "course selected,
//                               genuinely no marked days this month."
//   todayDate   {number|null} – day-of-month to outline as "today";
//                               pass null when viewing a month other
//                               than the current one
//   onPrevMonth {function}
//   onNextMonth {function}
//   navDisabled {boolean}    – disables both arrows while a fetch is in flight

import Icon from '../../shared/Icon/Icon';
import './AttendanceCalendar.css';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKEND_INDEXES = [5, 6]; // Sat, Sun in the Monday-first WEEKDAYS array

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// JS Date#getDay() returns 0=Sun..6=Sat. Convert to Monday-first
// index (0=Mon..6=Sun) so it lines up with the WEEKDAYS header.
function mondayFirstIndex(jsDay) {
  return (jsDay + 6) % 7;
}

function CalendarHeader({ monthLabel, onPrevMonth, onNextMonth, navDisabled }) {
  return (
    <div className="calendar__header">
      <h3 className="calendar__title">{monthLabel}</h3>
      <div className="calendar__nav">
        <button
          className="calendar__nav-btn"
          onClick={onPrevMonth}
          disabled={navDisabled}
          aria-label="Previous month"
        >
          <Icon name="chevronLeft" size={16} color="var(--ink)" />
        </button>
        <span className="calendar__nav-label">This month</span>
        <button
          className="calendar__nav-btn"
          onClick={onNextMonth}
          disabled={navDisabled}
          aria-label="Next month"
        >
          <Icon name="chevronRight" size={16} color="var(--ink)" />
        </button>
      </div>
    </div>
  );
}

export default function AttendanceCalendar({
  monthLabel,
  year,
  month,
  days = [],
  todayDate = null,
  onPrevMonth = () => {},
  onNextMonth = () => {},
  navDisabled = false,
}) {
  // No course selected yet — the backend has nothing to show.
  if (days === null) {
    return (
      <section className="calendar" aria-label="Attendance calendar">
        <CalendarHeader
          monthLabel={monthLabel}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          navDisabled={navDisabled}
        />
        <div
          className="calendar__empty"
          style={{ padding: '32px 8px', textAlign: 'center', color: '#8a93a3', fontSize: 14 }}
        >
          Select a course above to see the day-by-day calendar.
        </div>
      </section>
    );
  }

  const statusByDate = Object.fromEntries(days.map(d => [d.date, d.status]));
  const total = daysInMonth(year, month);
  const firstWeekday = mondayFirstIndex(new Date(year, month - 1, 1).getDay());

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  return (
    <section className="calendar" aria-label="Attendance calendar">
      <CalendarHeader
        monthLabel={monthLabel}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        navDisabled={navDisabled}
      />

      <div className="calendar__weekdays">
        {WEEKDAYS.map(w => (
          <span key={w} className="calendar__weekday">{w}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {cells.map((d, i) => {
          if (d === null) {
            return <span key={`blank-${i}`} className="calendar__cell calendar__cell--blank" />;
          }
          const weekdayIndex = (firstWeekday + d - 1) % 7;
          const isWeekend = WEEKEND_INDEXES.includes(weekdayIndex);
          const status = statusByDate[d];
          const isToday = d === todayDate;
          const cls = [
            'calendar__cell',
            !status && isWeekend ? 'calendar__cell--weekend' : '',
            status ? `calendar__cell--${status}` : '',
            isToday ? 'calendar__cell--today' : '',
          ].join(' ').trim();
          return <span key={d} className={cls}>{d}</span>;
        })}
      </div>

      <div className="calendar__legend">
        <span className="calendar__legend-item">
          <i className="calendar__legend-swatch calendar__legend-swatch--present" /> Present
        </span>
        <span className="calendar__legend-item">
          <i className="calendar__legend-swatch calendar__legend-swatch--absent" /> Absent
        </span>
        <span className="calendar__legend-item">
          <i className="calendar__legend-swatch calendar__legend-swatch--holiday" /> Holiday
        </span>
        <span className="calendar__legend-item">
          <i className="calendar__legend-swatch calendar__legend-swatch--today" /> Today
        </span>
      </div>
    </section>
  );
}