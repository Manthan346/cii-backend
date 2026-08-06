import ProfileCompletionCard from '../ProfileCompletionCard/ProfileCompletionCard';
import './BasicInformationTab.css';

// /**
//  * BasicInformationTab
//  *
//  * "Basic Information" tab content: Personal Information + Contact side
//  * by side, with the Profile completion ring/checklist alongside them.
//  * Below that, a separate full-width card shows Current Address and
//  * Permanent Address side by side (state/district/city/pin code as
//  * read-only pills).
//  *
//  * Field names match GET /instructor-profile directly (personal.dateOfBirth,
//  * contact.emergencyContact/email, currentAddress.current*, permanentAddress
//  * .permanenet*/permanent* - note the backend's own "permanenet" typo on
//  * two of the five permanent-address fields, kept as-is here rather than
//  * silently "fixed", since fixing it here would just break the mapping) -
//  * no separate mapper layer, same convention as AcademicDetailTab.
//  *
//  * The backend has no free-text address "line" field at all (only
//  * state/district/taluka/city/pincode), so the line paragraph only
//  * renders when one is present - it just won't show up until/unless a
//  * line field is added on the backend.**/
 
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function BasicInformationTab({
  personal,
  contact,
  currentAddress,
  permanentAddress,
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
                  {formatDate(personal.dateOfBirth)}
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
                  {contact.emergencyContact}
                </span>
              </div>
              <div className="basic-information-tab__field">
                <span className="basic-information-tab__label">Email - ID</span>
                <span className="basic-information-tab__value">
                  {contact.email}
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

              {current?.currentAddress && (
                <p className="basic-information-tab__address-line">
                  {current.currentAddress}
                </p>
              )}

              <div className="basic-information-tab__address-pills">
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">State</span>
                  <span className="basic-information-tab__pill">
                    {current?.currentState}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">District</span>
                  <span className="basic-information-tab__pill">
                    {current?.currentDistrict}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">City</span>
                  <span className="basic-information-tab__pill">
                    {current?.currentCity}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">Pin Code</span>
                  <span className="basic-information-tab__pill">
                    {current?.currentPincode}
                  </span>
                </div>
              </div>
            </div>

            <div className="basic-information-tab__divider" />

            <div className="basic-information-tab__column">
              <h3 className="basic-information-tab__heading">
                Permanent Address
              </h3>

              {permanent?.permanentAddress && (
                <p className="basic-information-tab__address-line">
                  {permanent.permanentAddress}
                </p>
              )}

              <div className="basic-information-tab__address-pills">
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">State</span>
                  <span className="basic-information-tab__pill">
                    {permanent?.permanenetState}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">District</span>
                  <span className="basic-information-tab__pill">
                    {permanent?.permanentDistrict}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">City</span>
                  <span className="basic-information-tab__pill">
                    {permanent?.permanenetCity}
                  </span>
                </div>
                <div className="basic-information-tab__pill-field">
                  <span className="basic-information-tab__label">Pin Code</span>
                  <span className="basic-information-tab__pill">
                    {permanent?.permanentPincode}
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
