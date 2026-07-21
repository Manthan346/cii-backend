import ProfileCompletionCard from "../ProfileCompletionCard/ProfileCompletionCard";
import "./BasicInformationTab.css";

/**
 * BasicInformationTab
 *
 * "Basic Information" tab content: Personal Information + Guardian
 * Information side by side in one card, and the Profile completion
 * ring/checklist in a second card alongside it.
 *
 * Note: this doesn't use the shared <SectionCard> - SectionCard always
 * renders its own title bar, but this panel's heading is the inline
 * underlined "Personal Information"/"Guardian Information" labels
 * instead, so a plain styled div matches the reference design better.
 */
export default function BasicInformationTab({ personal, guardian, completion }) {
  return (
    <div className="basic-information-tab">
      <div className="basic-information-tab__details">
        <div className="basic-information-tab__columns">
          <div className="basic-information-tab__column">
            <h3 className="basic-information-tab__heading">Personal Information</h3>

            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Name</span>
              <span className="basic-information-tab__value">{personal.name}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Gender</span>
              <span className="basic-information-tab__value">{personal.gender}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Date of Birth</span>
              <span className="basic-information-tab__value">{personal.dob}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Blood Group</span>
              <span className="basic-information-tab__value">{personal.bloodGroup}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Highest Qalification</span>
              <span className="basic-information-tab__value">{personal.highestQualification}</span>
            </div>
          </div>

          <div className="basic-information-tab__divider" />

          <div className="basic-information-tab__column">
            <h3 className="basic-information-tab__heading">Guardian Information</h3>

            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Name</span>
              <span className="basic-information-tab__value">{guardian.name}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Relationship</span>
              <span className="basic-information-tab__value">{guardian.relationship}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Mobile Number</span>
              <span className="basic-information-tab__value">{guardian.mobileNumber}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Occupation</span>
              <span className="basic-information-tab__value">{guardian.occupation}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Address</span>
              <span className="basic-information-tab__value">{guardian.address}</span>
            </div>
          </div>
        </div>
      </div>

      <ProfileCompletionCard
        percent={completion.percent}
        label={completion.label}
        checklist={completion.checklist}
      />
    </div>
  );
}
