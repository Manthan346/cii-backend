import './AcademicDetailTab.css';

/**
 * AcademicDetailTab
 *
 * "Academic Detail" tab content. Education and Experience are each
 * rendered in their own separate card container (per explicit request),
 * rather than sharing one panel like the reference screenshot did.
 *
 * Field names here match the backend response from
 * GET /academics-details directly (highestQualification,
 * additionalQualifications, previousOrganisation) - no mapper layer,
 * so if the backend renames these, update here.
 */
export default function AcademicDetailTab({ education, experience }) {
  return (
    <div className="academic-detail-tab">
      <div className="academic-detail-tab__card">
        <h3 className="academic-detail-tab__heading">Education</h3>

        <div className="academic-detail-tab__grid">
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">
              Highest Education
            </span>
            <span className="academic-detail-tab__value">
              {education.highestQualification}
            </span>
          </div>
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">Specialization</span>
            <span className="academic-detail-tab__value">
              {education.specialization}
            </span>
          </div>
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">University</span>
            <span className="academic-detail-tab__value">
              {education.university}
            </span>
          </div>
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">Passing year</span>
            <span className="academic-detail-tab__value">
              {education.passingYear}
            </span>
          </div>
          {/* <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">
              Additional Qualification
            </span>
            <span className="academic-detail-tab__value">
              {education.additionalQualifications}
            </span>
          </div>
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">Certifications:</span>
            <span className="academic-detail-tab__value">
              {education.certifications}
            </span>
          </div> */}
        </div>
      </div>

      <div className="academic-detail-tab__card">
        <h3 className="academic-detail-tab__heading">Experience</h3>

        <div className="academic-detail-tab__grid">
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">Total Experience</span>
            <span className="academic-detail-tab__value">
              {experience.totalExperience}
            </span>
          </div>
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">
              Previous Organization
            </span>
            <span className="academic-detail-tab__value">
              {experience.previousOrganisation}
            </span>
          </div>
          <div className="academic-detail-tab__field">
            <span className="academic-detail-tab__label">Role</span>
            <span className="academic-detail-tab__value">
              {experience.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
