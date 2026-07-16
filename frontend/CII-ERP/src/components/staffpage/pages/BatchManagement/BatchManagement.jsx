import React from "react";
import { Layers } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import "./BatchManagement.css";

/**
 * BatchManagement
 *
 * Staff page for managing batches.
 * This is a placeholder component that can be expanded with real functionality.
 */
const BatchManagement = () => {
  return (
    <div className="batch-management">
      <SectionCard title="Batch Management" className="batch-management__card">
        <div className="batch-management__content">
          <Layers size={48} className="batch-management__icon" />
          <h2>Batch Management</h2>
          <p>View and manage all training batches.</p>
          <p className="batch-management__placeholder-note">
            This page is under development. Content will be added soon.
          </p>
        </div>
      </SectionCard>
    </div>
  );
};

export default BatchManagement;