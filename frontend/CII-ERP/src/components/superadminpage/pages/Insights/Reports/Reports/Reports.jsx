import { useEffect, useState } from "react";
import {
  downloadEnrollmentReport,
  fetchEnrollmentReports,
} from "../../../../../../../api/superadmin/reportService";
import "./Reports.css";

const today = new Date();
const currentYearStart = `${today.getFullYear()}-01-01`;
const localToday = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

export default function Reports() {
  const [reports, setReports] = useState({ monthly: {}, centres: [] });
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [fromDate, setFromDate] = useState(currentYearStart);
  const [toDate, setToDate] = useState(localToday);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError("");
    fetchEnrollmentReports({
      centerId: selectedCentre,
      fromDate,
      toDate,
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
  }, [selectedCentre, fromDate, toDate]);

  const monthOrder = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(index);
    return date.toLocaleString("en", { month: "short" });
  });
  const monthlyReports = monthOrder.map((month) => ({
    month,
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
    if (!fromDate || !toDate) {
      setError("Select both a start date and an end date.");
      return;
    }
    if (fromDate > toDate) {
      setError("The start date must be on or before the end date.");
      return;
    }

    setError("");
    setIsDownloading(true);
    try {
      await downloadEnrollmentReport({
        fromDate,
        toDate,
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
            <span className="superadmin-reports__sr-only">From date</span>
            <input
              aria-label="From date"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>
          <label className="superadmin-reports__date-filter">
            <span className="superadmin-reports__sr-only">To date</span>
            <input
              aria-label="To date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
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
          All 12 months · {totalEnrollments.toLocaleString()} enrollments
          <span className="superadmin-reports__summary-note">
            {" "}
            · Date range applies to the downloaded report
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
