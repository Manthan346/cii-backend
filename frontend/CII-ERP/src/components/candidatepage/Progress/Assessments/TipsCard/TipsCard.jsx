// ============================================================================
// TipsCard.jsx
// ----------------------------------------------------------------------------
// Right-column "Tips before you start" card with helpful reminders.
//
// BACKEND NOTE: these tips are mostly static/editorial content. If you want
// them editable without a redeploy, fetch them from something like
// GET /api/content/assessment-tips instead of importing the local mock data.
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import { assessmentTips } from "../../../../../data/assessmentsData";
import "./TipsCard.css";

const TipsCard = ({ tips = assessmentTips }) => {
  return (
    <section className="tips-card card">
      <h2 className="tips-card__title">Tips before you start</h2>

      <ul className="tips-card__list">
        {tips.map((tip) => (
          <li className="tips-card__item" key={tip.id}>
            <span className="tips-card__icon">
              <Icon name={tip.icon} size={16} />
            </span>
            <span className="tips-card__text">{tip.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TipsCard;
