import React from "react";
import { Calendar } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import "./AttendanceManagement.css";

/**
 * AttendanceManagement
 *
 * Staff page for managing attendance.
 * This is a placeholder component that can be expanded with real functionality.
 */
const AttendanceManagement = () => {
  return (
    <div className="attendance-management">
      <SectionCard title="Attendance Management" className="attendance-management__card">
        <div className="attendance-management__content">
          <Calendar size={48} className="attendance-management__icon" />
          <h2>Attendance Management</h2>
          <p>Track and manage candidate attendance across batches.</p>
          <p className="attendance-management__placeholder-note">
            This page is under development. Content will be added soon.
          </p>
        </div>
      </SectionCard>
    </div>
  );
};

export default AttendanceManagement;