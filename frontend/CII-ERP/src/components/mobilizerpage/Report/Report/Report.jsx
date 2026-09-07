import React, { useState } from "react";
import ReportFilterBar from "../ReportFilterBar/ReportFilterBar";
import { downloadMobilizerEnquiryReport } from "../../../../../api/mobilizer/reportService";
import "./Report.css";

export default function Report() {
  const [range, setRange] = useState({ from: "", to: "" });
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

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

      {error && (
        <p className="report-page__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
