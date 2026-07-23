import ProfileCompletionCard from "../ProfileCompletionCard/ProfileCompletionCard";
import "./BasicInformationTab.css";

/**
 * BasicInformationTab
 *
 * "Basic Information" tab content: Personal Information + Contact side
 * by side, an Address block below (state/district/taluka/pin code as
 * read-only pills), and the Profile completion ring/checklist in a
 * second card alongside it.
 *
 * Contact + Address used to live in the separate "Contact Details" tab;
 * both now live here so a staff member's core info sits in one place.
 * Guardian Information moved the other way into the Contact Details tab.
 *
 * Note: this doesn't use the shared <SectionCard> - SectionCard always
 * renders its own title bar, but this panel's heading is the inline
 * underlined "Personal Information"/"Contact" labels instead, so a
 * plain styled div matches the reference design better.
 */
export default function BasicInformationTab({ personal, contact, address, completion }) {
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
            <h3 className="basic-information-tab__heading">Contact</h3>

            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Mobile Number</span>
              <span className="basic-information-tab__value">{contact.mobileNumber}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Emergency Contact Number</span>
              <span className="basic-information-tab__value">{contact.emergencyContactNumber}</span>
            </div>
            <div className="basic-information-tab__field">
              <span className="basic-information-tab__label">Email - ID</span>
              <span className="basic-information-tab__value">{contact.emailId}</span>
            </div>
          </div>
        </div>

        <div className="basic-information-tab__address-row">
          <div className="basic-information-tab__address-block">
            <h3 className="basic-information-tab__heading">Address</h3>
            <p className="basic-information-tab__address-line">{address.line}</p>
          </div>

          <div className="basic-information-tab__pill-field">
            <span className="basic-information-tab__label">State</span>
            <span className="basic-information-tab__pill">{address.state}</span>
          </div>
          <div className="basic-information-tab__pill-field">
            <span className="basic-information-tab__label">District</span>
            <span className="basic-information-tab__pill">{address.district}</span>
          </div>
          <div className="basic-information-tab__pill-field">
            <span className="basic-information-tab__label">Taluka</span>
            <span className="basic-information-tab__pill">{address.taluka}</span>
          </div>
          <div className="basic-information-tab__pill-field">
            <span className="basic-information-tab__label">Pin Code</span>
            <span className="basic-information-tab__pill">{address.pinCode}</span>
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
