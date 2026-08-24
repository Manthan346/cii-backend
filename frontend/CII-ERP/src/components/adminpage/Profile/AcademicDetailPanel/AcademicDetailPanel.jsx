import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import InfoField from '../../shared/InfoField/InfoField';
import './AcademicDetailPanel.css';

/**
 * AcademicDetailPanel
 *
 * Content shown under Profile's "Academic Detail" tab: Education and
 * Experience cards.
 *
 * Props:
 *  - education: { highestEducation, specialization, university, passingYear }
 *  - experience: { totalExperience, previousOrganization, role }
 *  see data/profileData.js -> profileData for the shape of both.
 */
const AcademicDetailPanel = ({ education, experience }) => {
  return (
    <div className="admin-academic-detail">
      <SectionCard title="Education">
        <div className="admin-academic-detail__grid">
          <InfoField label="Highest Education" value={education.highestEducation} />
          <InfoField label="Specialization" value={education.specialization} />
          <InfoField label="University" value={education.university} />
          <InfoField label="Passing year" value={education.passingYear} />
        </div>
      </SectionCard>

      <SectionCard title="Experience">
        <div className="admin-academic-detail__grid">
          <InfoField label="Total Experience" value={experience.totalExperience} />
          <InfoField label="Previous Organization" value={experience.previousOrganization} />
          <InfoField label="Role" value={experience.role} />
        </div>
      </SectionCard>
    </div>
  );
};

export default AcademicDetailPanel;
