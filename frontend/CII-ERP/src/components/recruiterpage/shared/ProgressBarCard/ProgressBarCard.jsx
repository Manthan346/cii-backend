import React from 'react';
import './ProgressBarCard.css';

/**
 * ProgressBarCard (shared)
 *
 * Reusable stacked progress-bar card: a title + a list of labeled
 * rows, each with a "count (percent%)" readout and a filled bar.
 * Backs the Dashboard's "Hiring Progress" card today and can back
 * any other funnel/breakdown later without changes.
 *
 * Props:
 *  - title: string
 *  - items: array               -> each item needs an `id` plus whatever labelKey/countKey/percentKey point to
 *  - labelKey: string (default 'label')
 *  - countKey: string (default 'count')
 *  - percentKey: string (default 'percent')
 *  - barColor: string (default '#4338ca')
 */
const ProgressBarCard = ({
  title,
  items,
  labelKey = 'label',
  countKey = 'count',
  percentKey = 'percent',
  barColor = '#4338ca',
}) => {
  return (
    <div className="progress-bar-card">
      <h3 className="progress-bar-card__title">{title}</h3>

      <div className="progress-bar-card__list">
        {items.map((item) => (
          <div key={item.id} className="progress-bar-card__row">
            <div className="progress-bar-card__row-header">
              <span className="progress-bar-card__label">{item[labelKey]}</span>
              <span className="progress-bar-card__count">
                {item[countKey]} ({item[percentKey]}%)
              </span>
            </div>
            <div className="progress-bar-card__bar-track">
              <div
                className="progress-bar-card__bar-fill"
                style={{ width: `${item[percentKey]}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBarCard;
