import { useEffect, useState } from "react";
import { fetchEnrollmentReports } from "../../../../../../../api/superadmin/reportService";
import "./Reports.css";

export default function Reports() {
  const [reports, setReports] = useState({ monthly: {}, byCenter: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    fetchEnrollmentReports()
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
  }, []);

  const monthOrder = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 5 + index);
    return date.toLocaleString("en", { month: "short" });
  });
  const monthlyReports = monthOrder.map((month) => ({
    month,
    enrollments: Number(reports.monthly[month] ?? 0),
  }));
  const centerReports = Object.entries(reports.byCenter)
    .map(([centre, enrollments]) => ({
      centre,
      enrollments: Number(enrollments),
    }))
    .sort((first, second) => second.enrollments - first.enrollments);

  const downloadCsv = () => {
    const rows = [
      ["Report type", "Month / centre", "Enrollments"],
      ...monthlyReports.map((report) => [
        "Monthly",
        report.month,
        report.enrollments,
      ]),
      ...centerReports.map((report) => [
        "Center",
        report.centre,
        report.enrollments,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "enrollment-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
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
          <div className="superadmin-reports__downloads">
            <button type="button" onClick={downloadCsv} disabled={isLoading}>
              ↓ Download CSV
            </button>
          </div>
        </div>
        <p className="superadmin-reports__summary">
          Last six months and enrollment totals by centre
        </p>
        <div className="superadmin-reports__table-wrap">
          <table className="superadmin-reports__table">
            <thead>
              <tr>
                <th>Month</th>
                <th>New enrollments</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="2">Loading enrollment reports...</td>
                </tr>
              ) : (
                monthlyReports.map((report) => (
                  <tr key={report.month}>
                    <td>{report.month}</td>
                    <td>{report.enrollments.toLocaleString()}</td>
                  </tr>
                ))
              )}
              {!isLoading && !monthlyReports.length && (
                <tr>
                  <td colSpan="2">No monthly enrollment data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="superadmin-reports__table-wrap superadmin-reports__table-wrap--centres">
          <table className="superadmin-reports__table">
            <thead>
              <tr>
                <th>Centre</th>
                <th>Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="2">Loading enrollment reports...</td>
                </tr>
              ) : (
                centerReports.map((report) => (
                  <tr key={report.centre}>
                    <td>{report.centre}</td>
                    <td>{report.enrollments.toLocaleString()}</td>
                  </tr>
                ))
              )}
              {!isLoading && !centerReports.length && (
                <tr>
                  <td colSpan="2">No center enrollment data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
