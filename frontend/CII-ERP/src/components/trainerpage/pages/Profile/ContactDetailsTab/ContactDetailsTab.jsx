import './ContactDetailsTab.css';

/**
 * ContactDetailsTab
 *
 * "Contact Details" tab content. Now shows Guardian Information - it
 * moved here from the Basic Information tab, which in turn picked up
 * Contact + Address (the content this tab used to hold).
 */
export default function ContactDetailsTab({ guardian }) {
  return (
    <div className="contact-details-tab">
      <h3 className="contact-details-tab__heading">Guardian Information</h3>

      <div className="contact-details-tab__grid">
        <div className="contact-details-tab__field">
          <span className="contact-details-tab__label">Name</span>
          <span className="contact-details-tab__value">{guardian.name}</span>
        </div>
        <div className="contact-details-tab__field">
          <span className="contact-details-tab__label">Relationship</span>
          <span className="contact-details-tab__value">
            {guardian.relationship}
          </span>
        </div>
        <div className="contact-details-tab__field">
          <span className="contact-details-tab__label">Mobile Number</span>
          <span className="contact-details-tab__value">
            {guardian.mobileNumber}
          </span>
        </div>
        <div className="contact-details-tab__field">
          <span className="contact-details-tab__label">Occupation</span>
          <span className="contact-details-tab__value">
            {guardian.occupation}
          </span>
        </div>
        <div className="contact-details-tab__field contact-details-tab__field--wide">
          <span className="contact-details-tab__label">Address</span>
          <span className="contact-details-tab__value">{guardian.address}</span>
        </div>
      </div>
    </div>
  );
}
