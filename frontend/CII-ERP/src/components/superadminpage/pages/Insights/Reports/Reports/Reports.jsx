import { useEffect, useState } from "react";
import {
  downloadEnrollmentReport,
  fetchEnrollmentReports,
} from "../../../../../../../api/superadmin/reportService";
import "./Reports.css";

const today = new Date();
const currentYearStart = `${today.getFullYear()}-01`;
const currentMonth = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
].join("-");

function getMonthRange(fromMonth, toMonth) {
  if (!fromMonth || !toMonth || fromMonth > toMonth) return [];

  const [startYear, startMonth] = fromMonth.split("-").map(Number);
  const [endYear, endMonth] = toMonth.split("-").map(Number);
  const months = [];

  for (
    let year = startYear, month = startMonth;
    year < endYear || (year === endYear && month <= endMonth);
    month += 1
  ) {
    if (month > 12) {
      year += 1;
      month = 1;
    }
    months.push(`${year}-${String(month).padStart(2, "0")}`);
  }

  return months;
}

function formatMonth(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const monthName = new Date(year, month - 1, 1).toLocaleString("en", {
    month: "short",
  });
  return `${monthName} ${year}`;
}

export default function Reports() {
  const [reports, setReports] = useState({ monthly: {}, centres: [] });
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [fromMonth, setFromMonth] = useState(currentYearStart);
  const [toMonth, setToMonth] = useState(currentMonth);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError("");
    fetchEnrollmentReports({
      centerId: selectedCentre,
      fromMonth,
      toMonth,
    })
      .then((data) => {
        if (isCurrent) setReports(data);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load enrollment reports.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedCentre, fromMonth, toMonth]);

  const monthlyReports = getMonthRange(fromMonth, toMonth).map((month) => ({
    month: formatMonth(month),
    enrollments: Number(reports.monthly[month] ?? 0),
  }));
  const selectedCentreName =
    selectedCentre === "all"
      ? "All Centres"
      : reports.centres.find(
          (centre) => String(centre.center_id) === selectedCentre,
        )?.center_name ?? "Selected Centre";
  const totalEnrollments = monthlyReports.reduce(
    (total, report) => total + report.enrollments,
    0,
  );

  const handleDownload = async () => {
    if (!fromMonth || !toMonth) {
      setError("Select both a start month and an end month.");
      return;
    }
    if (fromMonth > toMonth) {
      setError("The start month must be on or before the end month.");
      return;
    }

    setError("");
    setIsDownloading(true);
    try {
      await downloadEnrollmentReport({
        fromMonth,
        toMonth,
        centerId: selectedCentre,
      });
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download enrollment report.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="superadmin-reports">
      <div className="superadmin-reports__header">
        <h1>Enrollment Reports</h1>
        <p>Candidate enrollments by month and centre</p>
      </div>
      {error && (
        <p
          className="superadmin-feedback superadmin-feedback--error"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="superadmin-reports__panel">
        <div className="superadmin-reports__filters">
          <label className="superadmin-reports__date-filter">
            <span className="superadmin-reports__sr-only">From month</span>
            <input
              aria-label="From month"
              type="month"
              value={fromMonth}
              max={toMonth || undefined}
              onChange={(event) => setFromMonth(event.target.value)}
            />
          </label>
          <label className="superadmin-reports__date-filter">
            <span className="superadmin-reports__sr-only">To month</span>
            <input
              aria-label="To month"
              type="month"
              value={toMonth}
              min={fromMonth || undefined}
              onChange={(event) => setToMonth(event.target.value)}
            />
          </label>
          <label className="superadmin-reports__centre-filter">
            <span className="superadmin-reports__sr-only">Centre</span>
            <select
              aria-label="Filter by centre"
              value={selectedCentre}
              onChange={(event) => setSelectedCentre(event.target.value)}
              disabled={isLoading && !reports.centres.length}
            >
              <option value="all">All Centres</option>
              {reports.centres.map((centre) => (
                <option key={centre.center_id} value={String(centre.center_id)}>
                  {centre.center_name}
                </option>
              ))}
            </select>
          </label>
          <div className="superadmin-reports__downloads">
            <button
              className="superadmin-reports__download-excel"
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || isLoading}
            >
              {isDownloading ? "Downloading..." : "↓ Download Excel (.xlsx)"}
            </button>
          </div>
        </div>
        <p className="superadmin-reports__summary">
          {fromMonth && toMonth
            ? `${formatMonth(fromMonth)} – ${formatMonth(toMonth)}`
            : "Select a month range"}{" "}
          · {totalEnrollments.toLocaleString()} enrollments
          <span className="superadmin-reports__summary-note">
            {" "}
            · Selected month range applies to the downloaded report
          </span>
        </p>
        <div className="superadmin-reports__table-wrap">
          <table className="superadmin-reports__table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Centre</th>
                <th>New enrollments</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3">Loading enrollment reports...</td>
                </tr>
              ) : (
                monthlyReports.map((report) => (
                  <tr key={report.month}>
                    <td>{report.month}</td>
                    <td>{selectedCentreName}</td>
                    <td>{report.enrollments.toLocaleString()}</td>
                  </tr>
                ))
              )}
              {!isLoading && !monthlyReports.length && (
                <tr>
                  <td colSpan="3">No monthly enrollment data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
