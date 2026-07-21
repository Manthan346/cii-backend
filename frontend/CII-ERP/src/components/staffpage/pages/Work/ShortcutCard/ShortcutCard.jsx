import "./ShortcutCard.css";

/**
 * ShortcutCard (Work)
 *
 * One tile in the Work page's shortcut row: a colored square icon
 * badge + bold title + grey subtitle. Page-local since this exact
 * icon-badge-tile shape/tone set only appears on this page (same
 * pattern as Resources' QuickAccessCard).
 *
 * Clicking the tile calls `onClick`, which the Work page wires up to
 * navigate to the tile's route (/staff/task-assigned or
 * /staff/notifications - see data/workData.js).
 *
 * Props:
 *  - icon: LucideIcon -> icon rendered inside the badge
 *  - title: string    -> bold heading (e.g. "Task Assigned")
 *  - subtitle: string -> caption underneath (e.g. "24 tasks . 6 pending")
 *  - tone: string     -> 'dark' | 'mint', controls the badge background
 *  - onClick: function
 */
export default function ShortcutCard({ icon: Icon, title, subtitle, tone = "mint", onClick }) {
  return (
    <button type="button" className="shortcut-card" onClick={onClick}>
      <div className={`shortcut-card__icon shortcut-card__icon--${tone}`}>
        {Icon && <Icon size={22} strokeWidth={2} />}
      </div>
      <div className="shortcut-card__text">
        <div className="shortcut-card__title">{title}</div>
        <div className="shortcut-card__subtitle">{subtitle}</div>
      </div>
    </button>
  );
}
