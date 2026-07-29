import ProfileCompletionCard from '../ProfileCompletionCard/ProfileCompletionCard';
import './BasicInformationTab.css';

/**
 * BasicInformationTab
 *
 * "Basic Information" tab content: Personal Information + Contact side
 * by side, with the Profile completion ring/checklist alongside them.
 * Below that, a separate full-width card shows Current Address and
 * Permanent Address side by side (state/district/taluka/pin code as
 * read-only pills).
 */
export default function BasicInformationTab({
  personal,
  contact,
  currentAddress,
  permanentAddress,
  address, // legacy fallback, used as currentAddress if currentAddress isn't passed
  completion,
}) {
  const current = currentAddress;
  const permanent = permanentAddress;

  return (
    <div>
      <div className="basic-information-tab">
        <div className="basic-information-tab__details">
          <div className="basic-information-tab__columns">
            <div className="basic-information-tab__column">
              <h3 className="basic-information-tab__heading">
                Personal Information
              </h3>

              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">Name</span>
                <span className="basic-information-tab__value">
                  {personal.name}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">Gender</span>
                <span className="basic-information-tab__value">
                  {personal.gender}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">
                  Date of Birth
                </span>
                <span className="basic-information-tab__value">
                  {personal.dob}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">
                  Blood Group
                </span>
                <span className="basic-information-tab__value">
                  {personal.bloodGroup}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">
                  Highest Qalification
                </span>
                <span className="basic-information-tab__value">
                  {personal.highestQualification}
                </span>
              </div>
            </div>

            <div className="basic-information-tab__divider" />

            <div className="basic-information-tab__column">
              <h3 className="basic-information-tab__heading">Contact</h3>

              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">
                  Mobile Number
                </span>
                <span className="basic-information-tab__value">
                  {contact.mobileNumber}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">
                  Emergency Contact Number
                </span>
                <span className="basic-information-tab__value">
                  {contact.emergencyContactNumber}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">Email - ID</span>
                <span className="basic-information-tab__value">
                  {contact.emailId}
                </span>
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

      <div className="basic-information-address-tab">
        <div className="basic-information-tab__details">
          <div className="basic-information-tab__columns">
            <div className="basic-information-tab__column">
              <h3 className="basic-information-tab__heading">
                Current Address
              </h3>

              <p className="basic-information-tab__address-line">
                {current?.line}
              </p>

              <div className="basic-information-tab__address-pills">
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">State</span>
                  <span className="basic-information-tab__pill">
                    {current?.state}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">
                    District
                  </span>
                  <span className="basic-information-tab__pill">
                    {current?.district}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">Taluka</span>
                  <span className="basic-information-tab__pill">
                    {current?.taluka}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">
                    Pin Code
                  </span>
                  <span className="basic-information-tab__pill">
                    {current?.pinCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="basic-information-tab__divider" />

            <div className="basic-information-tab__column">
              <h3 className="basic-information-tab__heading">
                Permanent Address
              </h3>

              <p className="basic-information-tab__address-line">
                {permanent?.line}
              </p>

              <div className="basic-information-tab__address-pills">
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">State</span>
                  <span className="basic-information-tab__pill">
                    {permanent?.state}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">
                    District
                  </span>
                  <span className="basic-information-tab__pill">
                    {permanent?.district}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">Taluka</span>
                  <span className="basic-information-tab__pill">
                    {permanent?.taluka}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">
                    Pin Code
                  </span>
                  <span className="basic-information-tab__pill">
                    {permanent?.pinCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}