// AlertsTabs.jsx
// Dashboard panel for the candidate's recent assessment activity.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCandidateAssessments } from "../../../../services/Assessmentsservice";
import "./AlertsTabs.css";

function ItemList({ items }) {
  return items.map((item, i) => (
    <div key={i} className="alert-item">
      <span className="alert-item__dot" aria-hidden="true" />
      <div>
        <div className="alert-item__text">{item.text}</div>
        <div className="alert-item__meta">{item.meta}</div>
      </div>
    </div>
  ));
}

export default function AlertsTabs() {
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCandidateAssessments()
      .then((response) => {
        if (cancelled) return;

        const data = response.data?.data;
        const attempts = [
          ...(data?.pending || []).map((item) => ({
            ...item,
            state: "Being checked",
          })),
          ...(data?.completed || []).map((item) => ({
            ...item,
            state: "Completed",
          })),
        ]
          .filter((item) => item.assessments?.title)
          .sort((first, second) => {
            const firstTime = new Date(first.attempted_at || 0).getTime();
            const secondTime = new Date(second.attempted_at || 0).getTime();
            return secondTime - firstTime;
          })
          .slice(0, 5)
          .map((item) => ({
            text: item.assessments.title,
            meta: `${item.state} · ${
              item.attempted_at
                ? new Date(item.attempted_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date unavailable"
            }`,
          }));

        setRecentAssessments(attempts);
      })
      .catch(() => {
        if (!cancelled) setRecentAssessments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="alerts-tabs">
      <div className="alerts-tabs__header">
        <span className="alerts-tabs__title">Recent assessments</span>
        <Link to="/progress/assessments" className="alerts-tabs__view-all">
          View all
        </Link>
      </div>

      <div className="alerts-tabs__panel">
        {loading ? (
          <div
            className="alerts-tabs__skeleton"
            aria-label="Loading assessments"
          >
            <span className="skeleton-line" />
            <span className="skeleton-line" />
            <span className="skeleton-line" />
          </div>
        ) : recentAssessments.length ? (
          <ItemList items={recentAssessments} />
        ) : (
          <p className="alerts-tabs__empty">No recent assessments yet.</p>
        )}
      </div>
    </div>
  );
}
