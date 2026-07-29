import './GuardianDetailsTab.css';

/**
 * GuardianDetailsTab
 *
 * "Contact Details" tab content. Shows Guardian Information, followed
 * by the guardian's own Current Address and Permanent Address - both
 * sourced from guardian.currentAddress / guardian.permanentAddress
 * (not the staff member's address, which lives in Basic Information).
 * The old flat `guardian.address` string field has been removed now
 * that address is fully represented by the two structured objects.
 */
export default function GuardianDetailsTab({ guardian }) {
  return (
    <div className="guardian-details-tab">
      <h3 className="guardian-details-tab__heading">Guardian Information</h3>

      <div className="guardian-details-tab__grid">
        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Name</span>
          <span className="guardian-details-tab__value">{guardian.name}</span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Relationship</span>
          <span className="guardian-details-tab__value">
            {guardian.relationship}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Mobile Number</span>
          <span className="guardian-details-tab__value">
            {guardian.mobileNumber}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Occupation</span>
          <span className="guardian-details-tab__value">
            {guardian.occupation}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Blood Group</span>
          <span className="guardian-details-tab__value">
            {guardian.bloodGroup}
          </span>
        </div>
      </div>

      <div className="guardian-details-tab__address-section">
        <div className="guardian-details-tab__address-columns">
          <div className="guardian-details-tab__address-column">
            <h3 className="guardian-details-tab__heading">
              Current Address
            </h3>

            <p className="guardian-details-tab__address-line">
              {guardian.currentAddress?.line}
            </p>

            <div className="guardian-details-tab__pill-row">
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">State</span>
                <span className="guardian-details-tab__pill">
                  {guardian.currentAddress?.state}
                </span>
              </div>
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">District</span>
                <span className="guardian-details-tab__pill">
                  {guardian.currentAddress?.district}
                </span>
              </div>
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">Taluka</span>
                <span className="guardian-details-tab__pill">
                  {guardian.currentAddress?.taluka}
                </span>
              </div>
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">Pin Code</span>
                <span className="guardian-details-tab__pill">
                  {guardian.currentAddress?.pinCode}
                </span>
              </div>
            </div>
          </div>

          <div className="guardian-details-tab__address-divider" />

          <div className="guardian-details-tab__address-column">
            <h3 className="guardian-details-tab__heading">
              Permanent Address
            </h3>

            <p className="guardian-details-tab__address-line">
              {guardian.permanentAddress?.line}
            </p>

            <div className="guardian-details-tab__pill-row">
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">State</span>
                <span className="guardian-details-tab__pill">
                  {guardian.permanentAddress?.state}
                </span>
              </div>
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">District</span>
                <span className="guardian-details-tab__pill">
                  {guardian.permanentAddress?.district}
                </span>
              </div>
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">Taluka</span>
                <span className="guardian-details-tab__pill">
                  {guardian.permanentAddress?.taluka}
                </span>
              </div>
              <div className="guardian-details-tab__pill-field">
                <span className="guardian-details-tab__label">Pin Code</span>
                <span className="guardian-details-tab__pill">
                  {guardian.permanentAddress?.pinCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}