import React from 'react';
import './DashboardGreeting.css';

/**
 * DashboardGreeting
 * Small page header shown above the stats grid. Not present in the
 * reference screenshot's visible crop, but included since the folder
 * already existed — kept compact so it doesn't throw off the page's
 * overall proportions. Swap the copy for a real "Good morning, {name}"
 * once user data is wired up.
 */
export default function DashboardGreeting() {
  return (
    <div className="md-greeting">
      <h1 className="md-greeting__title">Good morning 👋</h1>
      <p className="md-greeting__subtitle">Here's today's enquiry and placement overview</p>
    </div>
  );
}
