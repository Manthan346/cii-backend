import './QuickAccessCard.css';

/**
 * QuickAccessCard (Resources)
 *
 * One tile in the Resources page's shortcut row: a colored square icon
 * badge + bold title + grey subtitle. Page-local since this exact
 * icon-badge-tile shape/tone set only appears on this page.
 *
 * Props:
 *  - icon: LucideIcon -> icon rendered inside the badge
 *  - title: string    -> bold heading (e.g. "Reports")
 *  - subtitle: string -> caption underneath (e.g. "38 generated reports")
 *  - tone: string     -> 'teal' | 'mint', controls the badge background
 */
export default function QuickAccessCard({
  icon: Icon,
  title,
  subtitle,
  tone = 'mint',
  onClick,
}) {
  return (
    <button type="button" className={'card'} onClick={onClick}>
      <div className={`${'iconWrap'} ${tone || 'mint'}`}>
        {Icon && <Icon size={22} strokeWidth={2} />}
      </div>
      <div className={'text'}>
        <div className={'title'}>{title}</div>
        <div className={'subtitle'}>{subtitle}</div>
      </div>
    </button>
  );
}
