import './AttendanceChart.css';

const DATA = [
  { day: 'MON', value: 90 },
  { day: 'TUE', value: 76 },
  { day: 'WED', value: 52 },
  { day: 'THU', value: 94 },
  { day: 'FRI', value: 100, current: true },
  { day: 'SAT', value: 82 },
  { day: 'SUN', value: 0 },
];

const MAX = 100;
const CHART_H = 120;

export default function AttendanceChart() {
  return (
    <div className="attendance-chart">
      <h2 className="attendance-chart__title">Attendance - Last 7 days</h2>

      <div className="attendance-chart__body">
        <div className="attendance-chart__y-axis" style={{ height: CHART_H }}>
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        <div className="attendance-chart__bars">
          {DATA.map(({ day, value, current }) => {
            const barH = (value / MAX) * CHART_H;
            return (
              <div key={day} className="attendance-chart__bar-group">
                <div
                  className="attendance-chart__bar"
                  style={{
                    height: barH || 4,
                    backgroundColor: current ? '#94a3b8' : '#1e3a8a',
                    opacity: value === 0 ? 0.15 : 1,
                  }}
                />
                <span className="attendance-chart__day-label">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
