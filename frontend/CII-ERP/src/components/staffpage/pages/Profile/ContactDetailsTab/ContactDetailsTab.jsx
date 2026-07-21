import "./ContactDetailsTab.css";

/**
 * ContactDetailsTab
 *
 * "Contact Details" tab content: a Contact section (mobile/emergency
 * numbers on the left, email on the right, separated by a vertical
 * divider) and an Address section below it with State/District/Taluka/
 * Pin Code shown as read-only pill fields.
 */
export default function ContactDetailsTab({ contact, address }) {
  return (
    <div className="contact-details-tab">
      <div className="contact-details-tab__row">
        <div className="contact-details-tab__column">
          <h3 className="contact-details-tab__heading">Contact</h3>

          <div className="contact-details-tab__field">
            <span className="contact-details-tab__label">Mobile Number</span>
            <span className="contact-details-tab__value">{contact.mobileNumber}</span>
          </div>
          <div className="contact-details-tab__field">
            <span className="contact-details-tab__label">Emergency Contact Number</span>
            <span className="contact-details-tab__value">{contact.emergencyContactNumber}</span>
          </div>
        </div>

        <div className="contact-details-tab__divider" />

        <div className="contact-details-tab__column">
          <div className="contact-details-tab__field">
            <span className="contact-details-tab__label">Email - ID</span>
            <span className="contact-details-tab__value">{contact.emailId}</span>
          </div>
        </div>
      </div>

      <div className="contact-details-tab__address-row">
        <div className="contact-details-tab__address-block">
          <h3 className="contact-details-tab__heading">Address</h3>
          <p className="contact-details-tab__address-line">{address.line}</p>
        </div>

        <div className="contact-details-tab__pill-field">
          <span className="contact-details-tab__label">State</span>
          <span className="contact-details-tab__pill">{address.state}</span>
        </div>
        <div className="contact-details-tab__pill-field">
          <span className="contact-details-tab__label">District</span>
          <span className="contact-details-tab__pill">{address.district}</span>
        </div>
        <div className="contact-details-tab__pill-field">
          <span className="contact-details-tab__label">Taluka</span>
          <span className="contact-details-tab__pill">{address.taluka}</span>
        </div>
        <div className="contact-details-tab__pill-field">
          <span className="contact-details-tab__label">Pin Code</span>
          <span className="contact-details-tab__pill">{address.pinCode}</span>
        </div>
      </div>
    </div>
  );
}
