import useCountUp from "../../../shared/hooks/useCountUp";
import "./StatCard.css";

/**
 * StatCard (Work)
 *
 * Summary card for the Work header row ("24 Task assigned",
 * "16 Completed", "6 Pending", "5 Unread notification").
 *
 * tone: 'blue' | 'green' | 'yellow' - controls the square icon badge
 * color, matching the reference design.
 *
 * NOTE: page-local variant (like the Resources/Reports page
 * StatCards) since this tone palette is specific to the Work page, so
 * it's kept out of /shared.
 */
export default function StatCard({ icon: Icon, value, label, tone = "blue" }) {
  const animatedValue = useCountUp(value, 1200);

  return (
    <div className="work-stat-card">
      <div className={`work-stat-card__icon work-stat-card__icon--${tone}`}>
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className="work-stat-card__value">{animatedValue}</div>
      <div className="work-stat-card__label">{label}</div>
    </div>
  );
}
