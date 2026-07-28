import { SectionCard } from "../../../shared";
import { FileCheck2, Bell, Layers } from "lucide-react";
import "./RecentActivity.css";

const ACTIVITY_ICONS = {
  "file-check": FileCheck2,
  bell: Bell,
  layers: Layers,
};

/**
 * RecentActivity (Work)
 *
 * "Recent activity" panel on the Work page: a mint icon square + bold
 * title + grey meta line for each event. Built with the reusable
 * <SectionCard> from /shared (its built-in `actionLabel` prop gives us
 * the top-right "View all" link for free) - only the row layout is
 * page-specific.
 */
export default function RecentActivity({ items = [], onViewAll }) {
  return (
    <SectionCard title="Recent activity" actionLabel="View all" onActionClick={onViewAll} className="recent-activity">
      <ul className="recent-activity__list">
        {items.map((item) => {
          const Icon = ACTIVITY_ICONS[item.icon] || Bell;
          return (
            <li className="recent-activity__item" key={item.id}>
              <div className="recent-activity__icon">
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="recent-activity__content">
                <p className="recent-activity__title">{item.title}</p>
                <p className="recent-activity__meta">{item.meta}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
