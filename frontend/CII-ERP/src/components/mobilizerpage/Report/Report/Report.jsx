import React, { useState } from "react";
import { useEffect } from "react";
import ReportFilterBar from "../ReportFilterBar/ReportFilterBar";
import SectionCard from "../../shared/SectionCard/SectionCard";
import { BarChartWidget } from "../../shared/charts";
import {
  downloadMobilizerEnquiryReport,
  fetchEnrollmentAnalytics,
} from "../../../../../api/mobilizer/reportService";
import "./Report.css";

function getChartConfig(data) {
  const max = Math.max(100, ...data.map(({ value }) => value));
  return { yMax: max, yStep: Math.max(1, Math.ceil(max / 5)) };
}

export default function Report() {
  const [range, setRange] = useState({ from: "", to: "" });
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setAnalyticsLoading(true);
    setAnalyticsError("");
    fetchEnrollmentAnalytics(range)
      .then((result) => {
        if (active) setAnalytics(result);
      })
      .catch((requestError) => {
        if (active) {
          setAnalyticsError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load enrollment analytics.",
          );
        }
      })
      .finally(() => {
        if (active) setAnalyticsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [range]);

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      await downloadMobilizerEnquiryReport({
        from_date: range.from,
        to_date: range.to,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to export report.",
      );
    } finally {
      setExporting(false);
    }
  };

  const courseWiseData = (analytics?.course_wise_enrollment ?? []).map(
    ({ course, enrollment }, index) => ({
      label: `C${index + 1}`,
      tooltipLabel: course,
      value: enrollment,
    }),
  );
  const monthlyData = (analytics?.monthly_enrollment ?? []).map(
    ({ month, enrollment }) => ({ label: month, value: enrollment }),
  );
  const courseWiseConfig = getChartConfig(courseWiseData);
  const monthlyConfig = getChartConfig(monthlyData);

  return (
    <div className="report-page">
      <div className="rp-header">
        <h1 className="rp-header__title">Reports</h1>
        <p className="rp-header__subtitle">
          Export enquiry records with optional date filters
        </p>
      </div>

      <ReportFilterBar
        onApply={setRange}
        onExport={handleExport}
        exporting={exporting}
      />

      <div className="rp-row">
        <SectionCard title="Course-wise Enrollment">
          {analyticsLoading ? (
            <p>Loading enrollment analytics...</p>
          ) : analyticsError ? (
            <p className="report-page__error">{analyticsError}</p>
          ) : courseWiseData.length === 0 ? (
            <p>No course enrollment data for this period.</p>
          ) : (
            <BarChartWidget
              data={courseWiseData}
              yMax={courseWiseConfig.yMax}
              yStep={courseWiseConfig.yStep}
              valueLabel="enrollments"
            />
          )}
        </SectionCard>

        <SectionCard title="Monthly Enrollment">
          {analyticsLoading ? (
            <p>Loading enrollment analytics...</p>
          ) : analyticsError ? (
            <p className="report-page__error">{analyticsError}</p>
          ) : monthlyData.length === 0 ? (
            <p>No monthly enrollment data for this period.</p>
          ) : (
            <BarChartWidget
              data={monthlyData}
              yMax={monthlyConfig.yMax}
              yStep={monthlyConfig.yStep}
              valueLabel="enrollments"
            />
          )}
        </SectionCard>
      </div>

      {error && (
        <p className="report-page__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
