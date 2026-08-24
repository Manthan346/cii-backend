import React from 'react';
import './ActivityFeedCard.css';

/**
 * ActivityFeedCard (shared)
 *
 * Reusable bulleted feed card: a title + a list of {text, time}
 * entries with a colored dot marker. Backs the Dashboard's
 * "Recent Activity" card today and can back any other section's
 * activity/notification feed later without changes.
 *
 * Props:
 *  - title: string
 *  - items: array                  -> each item needs an `id` plus whatever textKey/timeKey point to
 *  - textKey: string (default 'text')
 *  - timeKey: string (default 'time')
 *  - dotColor: string (default '#6366f1')
 */
const ActivityFeedCard = ({ title, items, textKey = 'text', timeKey = 'time', dotColor = '#6366f1' }) => {
  return (
    <div className="activity-feed-card">
      <h3 className="activity-feed-card__title">{title}</h3>

      <ul className="activity-feed-card__list">
        {items.map((item) => (
          <li key={item.id} className="activity-feed-card__item">
            <span
              className="activity-feed-card__dot"
              style={{ backgroundColor: dotColor }}
              aria-hidden="true"
            />
            <div className="activity-feed-card__body">
              <p className="activity-feed-card__text">{item[textKey]}</p>
              <span className="activity-feed-card__time">{item[timeKey]}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeedCard;
