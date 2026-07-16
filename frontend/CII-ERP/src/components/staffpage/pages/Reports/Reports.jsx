import React from "react";
import { BarChart3 } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import "./Reports.css";

/**
 * Reports
 *
 * Staff page for viewing reports.
 * This is a placeholder component that can be expanded with real functionality.
 */
const Reports = () => {
  return (
    <div className="reports">
      <SectionCard title="Reports" className="reports__card">
        <div className="reports__content">
          <BarChart3 size={48} className="reports__icon" />
          <h2>Reports</h2>
          <p>View and generate reports for your training programs.</p>
          <p className="reports__placeholder-note">
            This page is under development. Content will be added soon.
          </p>
        </div>
      </SectionCard>
    </div>
  );
};

export default Reports;