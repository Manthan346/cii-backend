// CourseList.jsx
// Horizontally scrollable row of CourseCards with arrow controls.
//
// Props:
//   cards  {Array}  – Array of course objects (see courseCards data shape).
//   search {string} – Search query; filters by company name or tag.
//
// Backend hookup:
//   Replace the static `courseCards` import in Dashboard.jsx with
//   data fetched from /api/courses, then pass it as the `cards` prop.

import { useRef } from 'react';
import CourseCard from '../CourseCard/CourseCard';
import Icon from '../../shared/Icon/Icon';
import './CourseList.css';

const SCROLL_STEP = 280; // px per arrow click

export default function CourseList({ cards = [], search = '' }) {
  const trackRef = useRef(null);

  const scroll = direction => {
    trackRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
  };

  const filtered = cards.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.company.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q)
    );
  });

  return (
    <section aria-label="Available Courses">

      {/* Heading + arrow controls */}
      <div className="course-list__header">
        <h2 className="course-list__title">Available Courses</h2>
        <div className="course-list__controls">
          <button
            className="course-list__scroll-btn"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <Icon name="chevronLeft" size={18} color="var(--ink)" />
          </button>
          <button
            className="course-list__scroll-btn"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <Icon name="chevronRight" size={18} color="var(--ink)" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div ref={trackRef} className="course-list__track">
        {filtered.map(card => (
          <CourseCard key={card.id} card={card} />
        ))}
      </div>

      <p className="course-list__hint">
        {filtered.length} of {cards.length} courses shown
        &nbsp;·&nbsp; scroll or use arrows to browse
      </p>

    </section>
  );
}
