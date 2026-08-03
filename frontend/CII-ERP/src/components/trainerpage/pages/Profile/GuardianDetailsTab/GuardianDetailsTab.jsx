import './GuardianDetailsTab.css';

/**
 * GuardianDetailsTab
 *
 * "Guardian Details" tab content. Shows Guardian Information for the
 * active guardian, including a single flat `guardian.address` text
 * field (not the staff member's own address, which lives in Basic
 * Information as separate currentAddress/permanentAddress objects).
 */
export default function GuardianDetailsTab({ guardians, activeIndex, onIndexChange }) {
  if (!guardians || guardians.length === 0) {
    return (
      <div className="guardian-details-tab">
        <p className="guardian-details-tab__empty">
          No guardian details added yet.
        </p>
      </div>
    );
  }

const guardian = guardians[activeIndex];


  return (
    <div className="guardian-details-tab">
      <div className="guardian-details-tab__sub-tabs">
        {guardians.map((g, index) => (
          <button
            key={index}
            type="button"
            className={`guardian-details-tab__sub-tab ${
              index === activeIndex ? 'guardian-details-tab__sub-tab--active' : ''
            }`}
            onClick={() => onIndexChange(index)}
          >
            {/* {index + 1}.Guardian detail */}
            {g.relationship}'s detail
          </button>
        ))}
      </div>
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

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Address</span>
          <span className="guardian-details-tab__value">
            {guardian.address}
          </span>
        </div>
      </div>

      <div className="guardian-details-tab__nav">
        <button
          type="button"
          className="guardian-details-tab__nav-btn"
          onClick={() => onIndexChange(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous guardian"
        >
          &lt;
        </button>
        <button
          type="button"
          className="guardian-details-tab__nav-btn"
          onClick={() => onIndexChange(activeIndex + 1)}
          disabled={activeIndex === guardians.length - 1}
          aria-label="Next guardian"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
