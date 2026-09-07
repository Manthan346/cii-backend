import React, { useEffect, useState } from "react";
import ReportsFilterBar from "../ReportsFilterBar/ReportsFilterBar";
import CompanyEnrollmentFilterBar from "../CompanyEnrollmentFilterBar/CompanyEnrollmentFilterBar";
import { BarChart } from "../../../shared/Charts";
import {
  downloadEnrollmentReport,
  downloadEnquiryReport,
  fetchEnrollmentAnalytics,
} from "../../../../../../api/admin/reportsService";
import { fetchAdminCourseFilterOptions } from "../../../../../../api/admin/coursesService";
import "./ReportsAnalytics.css";

// Splits a course name into up to 2 lines for the x-axis label,
// matching the wrapped-label shape BarChart already expects.
function wrapLabel(text = "") {
  const words = String(text).trim().split(/\s+/);
  if (words.length <= 1) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

// Picks a clean y-axis (min/max/step) from real data instead of the
// hardcoded 0–100 the mock data used.
function computeYConfig(values) {
  const max = Math.max(0, ...values);
  if (max <= 0) return { yMin: 0, yMax: 10, yStep: 2 };
  const step = Math.max(1, Math.ceil(max / 5 / 5) * 5);
  return { yMin: 0, yMax: step * 5, yStep: step };
}

export default function ReportsAnalytics() {
  const [exportingEnrollment, setExportingEnrollment] = useState(false);
  const [exportingEnquiry, setExportingEnquiry] = useState(false);
  const [courseOptions, setCourseOptions] = useState([
    { value: "all", label: "All Courses" },
  ]);

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchAdminCourseFilterOptions()
      .then((options) => {
        if (!cancelled) setCourseOptions(options);
      })
      .catch(() => {});

    setAnalyticsLoading(true);
    setAnalyticsError("");
    fetchEnrollmentAnalytics()
      .then((data) => {
        if (!cancelled) setAnalytics(data);
      })
      .catch((err) => {
        if (!cancelled) setAnalyticsError(err.message);
      })
      .finally(() => {
        if (!cancelled) setAnalyticsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleExportEnrollment = async (filters) => {
    setExportingEnrollment(true);
    try {
      await downloadEnrollmentReport(filters);
    } finally {
      setExportingEnrollment(false);
    }
  };

  const handleExportEnquiry = async (filters) => {
    setExportingEnquiry(true);
    try {
      await downloadEnquiryReport(filters);
    } finally {
      setExportingEnquiry(false);
    }
  };

  const courseEnrollmentData = (analytics?.course_wise_enrollment ?? []).map(
    (c) => ({ label: wrapLabel(c.course), value: c.enrollment }),
  );
  const courseEnrollmentConfig = computeYConfig(
    courseEnrollmentData.map((d) => d.value),
  );

  const monthlyAdmissionsData = (analytics?.monthly_enrollment ?? []).map(
    (m) => ({ label: m.month, value: m.enrollment }),
  );
  const monthlyAdmissionsConfig = computeYConfig(
    monthlyAdmissionsData.map((d) => d.value),
  );

  return (
    <div className="reports-analytics">
      <div className="ra-header">
        <div className="ra-header__text">
          <h1 className="ra-header__title">Reports &amp; analytics</h1>
          <p className="ra-header__subtitle">
            Institution-wide performance across centers and courses
          </p>
        </div>
      </div>

      <ReportsFilterBar
        title="Total Enrollments"
        courseOptions={courseOptions}
        onExport={handleExportEnrollment}
        exporting={exportingEnrollment}
      />

      <ReportsFilterBar
        title="Enquiries"
        courseOptions={courseOptions}
        onExport={handleExportEnquiry}
        exporting={exportingEnquiry}
      />

      <CompanyEnrollmentFilterBar />

      <div className="ra-grid">
        <section className="ra-card">
          <h2 className="ra-card__title">Course-wise enrollment</h2>
          {analyticsLoading ? (
            <p>Loading…</p>
          ) : analyticsError ? (
            <p className="ra-filterbar-section__error">{analyticsError}</p>
          ) : courseEnrollmentData.length === 0 ? (
            <p>No enrollment data for this period.</p>
          ) : (
            <BarChart
              data={courseEnrollmentData}
              yMin={courseEnrollmentConfig.yMin}
              yMax={courseEnrollmentConfig.yMax}
              yStep={courseEnrollmentConfig.yStep}
            />
          )}
        </section>

        <section className="ra-card">
          <h2 className="ra-card__title">Monthly admissions</h2>
          {analyticsLoading ? (
            <p>Loading…</p>
          ) : analyticsError ? (
            <p className="ra-filterbar-section__error">{analyticsError}</p>
          ) : monthlyAdmissionsData.length === 0 ? (
            <p>No admissions data for this period.</p>
          ) : (
            <BarChart
              data={monthlyAdmissionsData}
              yMin={monthlyAdmissionsConfig.yMin}
              yMax={monthlyAdmissionsConfig.yMax}
              yStep={monthlyAdmissionsConfig.yStep}
            />
          )}
        </section>
      </div>
    </div>
  );
}
