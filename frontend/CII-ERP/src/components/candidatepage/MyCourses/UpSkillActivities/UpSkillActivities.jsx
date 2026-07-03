// UpSkillActivities.jsx
// "Up Skill Activities" panel — right column of the My Courses progress row.
// Short-form activities/workshops with a downloadable certificate.
//
// Props:
//   activities  {Array}  – [{ id, icon, iconBg, iconColor, title,
//                             completedDate, durationLabel, professor,
//                             certificateUrl }]
//                          TODO: from /api/candidate/upskill-activities
//
// Backend hookup:
//   const [activities, setActivities] = useState([]);
//   useEffect(() => {
//     fetch('/api/candidate/upskill-activities')
//       .then(r => r.json())
//       .then(data => setActivities(data.map(a => ({
//         id: a.id,
//         icon: a.iconName,
//         iconBg: a.iconBgColor,
//         iconColor: a.iconColor,
//         title: a.activityName,
//         completedDate: a.completedOn,
//         durationLabel: a.durationLabel,
//         professor: a.instructorName,
//         certificateUrl: a.certificateDownloadUrl,
//       }))));
//   }, []);

import Icon from '../../shared/Icon/Icon';
import './UpSkillActivities.css';

function ActivityRow({ activity }) {
  return (
    <li className="upskill__item">
      <div
        className="upskill__icon"
        style={{ background: activity.iconBg }}
      >
        <Icon name={activity.icon} size={17} color={activity.iconColor} />
      </div>

      <div className="upskill__info">
        <div className="upskill__name">{activity.title}</div>
        <div className="upskill__meta">
          Completed {activity.completedDate}
          {activity.durationLabel ? ` (${activity.durationLabel})` : ''}
          {activity.professor ? ` \u00b7 ${activity.professor}` : ''}
        </div>
      </div>

      <a
        className="upskill__certificate"
        href={activity.certificateUrl || '#'}
        aria-label={`Download certificate for ${activity.title}`}
        onClick={e => { if (!activity.certificateUrl) e.preventDefault(); }}
      >
        <span>Certificate</span>
        <Icon name="download" size={14} color="#003C7E" />
      </a>
    </li>
  );
}

export default function UpSkillActivities({ activities = [] }) {
  if (!activities.length) return null;

  return (
    <section className="upskill" aria-label="Up skill activities">
      <div className="upskill__header">
        <h2 className="upskill__title">Up Skill Activities</h2>
      </div>

      <ul className="upskill__list">
        {activities.map(activity => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </ul>
    </section>
  );
}
