import { enrollmentReports } from "../../../../data";
import "./Reports.css";

export default function Reports() {
  const downloadCsv = () => {
    const rows = [
      ["Date", "Centre", "New enrollments"],
      ...enrollmentReports.map((report) => [
        report.date,
        report.centre,
        report.enrollments,
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\r\n");
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
        <p>Date-wise candidate enrollment</p>
      </div>
      <div className="superadmin-reports__panel">
        <div className="superadmin-reports__filters">
          <input aria-label="Start date" type="date" defaultValue="2026-08-29" />
          <input aria-label="End date" type="date" defaultValue="2026-09-28" />
          <select aria-label="Centre filter"><option>All Centres</option></select>
          <div className="superadmin-reports__downloads">
            <button type="button" onClick={downloadCsv}>↓ Download CSV</button>
          </div>
        </div>
        <p className="superadmin-reports__summary">31 day(s) · 3,910 enrollments</p>
        <div className="superadmin-reports__table-wrap">
          <table className="superadmin-reports__table">
            <thead><tr><th>Date</th><th>Centre</th><th>New enrollments</th></tr></thead>
            <tbody>{enrollmentReports.map((report) => (
              <tr key={report.id}>
                <td>{report.date}</td><td>{report.centre}</td><td>{report.enrollments}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
