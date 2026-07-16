import React from "react";
import { Boxes } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import "./Resources.css";

/**
 * Resources
 *
 * Staff page for managing resources.
 * This is a placeholder component that can be expanded with real functionality.
 */
const Resources = () => {
  return (
    <div className="resources">
      <SectionCard title="Resources" className="resources__card">
        <div className="resources__content">
          <Boxes size={48} className="resources__icon" />
          <h2>Resources</h2>
          <p>Access and manage training resources and materials.</p>
          <p className="resources__placeholder-note">
            This page is under development. Content will be added soon.
          </p>
        </div>
      </SectionCard>
    </div>
  );
};

export default Resources;