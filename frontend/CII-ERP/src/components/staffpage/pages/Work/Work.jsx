import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import "./Work.css";

/**
 * Work
 *
 * Staff page for work management.
 * This is a placeholder component that can be expanded with real functionality.
 */
const Work = () => {
  return (
    <div className="work">
      <SectionCard title="Work" className="work__card">
        <div className="work__content">
          <BriefcaseBusiness size={48} className="work__icon" />
          <h2>Work</h2>
          <p>Manage your assigned work and tasks.</p>
          <p className="work__placeholder-note">
            This page is under development. Content will be added soon.
          </p>
        </div>
      </SectionCard>
    </div>
  );
};

export default Work;