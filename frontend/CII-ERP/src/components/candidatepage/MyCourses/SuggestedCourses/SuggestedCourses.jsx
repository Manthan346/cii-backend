// SuggestedCourses.jsx
// "Suggested for you" panel — personalised recommendation(s) based on
// the candidate's completed/enrolled history, with a one-click Enroll CTA.
//
// Props:
//   suggestions  {Array}  – [{ id, icon, iconBg, iconColor, title,
//                              reason, ctaLabel }]
//                           TODO: from /api/candidate/suggested-courses
//   onEnroll     {func}   – called with the suggestion id when Enroll is clicked
//
// Backend hookup:
//   const [suggestions, setSuggestions] = useState([]);
//   useEffect(() => {
//     fetch('/api/candidate/suggested-courses')
//       .then(r => r.json())
//       .then(data => setSuggestions(data.map(s => ({
//         id: s.id,
//         icon: s.iconName,
//         iconBg: s.iconBgColor,
//         iconColor: s.iconColor,
//         title: s.courseName,
//         reason: s.recommendationReason,
//         ctaLabel: s.ctaLabel ?? 'Enroll',
//       }))));
//   }, []);
//
//   const handleEnroll = (id) =>
//     fetch(`/api/candidate/courses/${id}/enroll`, { method: 'POST' });

import Icon from '../../shared/Icon/Icon';
import './SuggestedCourses.css';

function SuggestionRow({ suggestion, onEnroll }) {
  return (
    <li className="suggested-courses__item">
      <div
        className="suggested-courses__icon"
        style={{ background: suggestion.iconBg }}
      >
        <Icon name={suggestion.icon} size={18} color={suggestion.iconColor} />
      </div>

      <div className="suggested-courses__info">
        <div className="suggested-courses__name">{suggestion.title}</div>
        <div className="suggested-courses__reason">{suggestion.reason}</div>
      </div>

      <button
        type="button"
        className="suggested-courses__enroll"
        onClick={() => onEnroll?.(suggestion.id)}
      >
        {suggestion.ctaLabel || 'Enroll'}
      </button>
    </li>
  );
}

export default function SuggestedCourses({ suggestions = [], onEnroll }) {
  if (!suggestions.length) return null;

  return (
    <section className="suggested-courses" aria-label="Suggested for you">
      <h2 className="suggested-courses__title">Suggested for you</h2>
      <ul className="suggested-courses__list">
        {suggestions.map(suggestion => (
          <SuggestionRow
            key={suggestion.id}
            suggestion={suggestion}
            onEnroll={onEnroll}
          />
        ))}
      </ul>
    </section>
  );
}
