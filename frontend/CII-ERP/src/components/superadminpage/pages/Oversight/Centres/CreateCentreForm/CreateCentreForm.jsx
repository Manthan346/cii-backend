import "./CreateCentreForm.css";

export default function CreateCentreForm({
  onClose,
  onCreateCentre,
  isSubmitting,
  error,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onCreateCentre({
      center_name: String(formData.get("center_name") || "").trim(),
      center_address: String(formData.get("center_address") || "").trim(),
      center_email: String(formData.get("center_email") || "").trim(),
      center_contact: String(formData.get("center_contact") || "").trim(),
      center_code: String(formData.get("center_code") || "").trim(),
      city_name: String(formData.get("city_name") || "").trim(),
    });
  };

  return (
    <div
      className="create-centre-form__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="create-centre-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-centre-form-title"
      >
        <div className="create-centre-form__header">
          <div>
            <h2 id="create-centre-form-title">Add a centre</h2>
            <p>Enter the centre details below.</p>
          </div>
          <button
            className="create-centre-form__close"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form className="create-centre-form__fields" onSubmit={handleSubmit}>
          <label>
            Centre name
            <input
              name="center_name"
              type="text"
              autoComplete="organization"
              required
            />
          </label>
          <label>
            Centre address
            <input
              name="center_address"
              type="text"
              autoComplete="street-address"
              required
            />
          </label>
          <div className="create-centre-form__row">
            <label>
              Email
              <input
                name="center_email"
                type="email"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Contact number
              <input
                name="center_contact"
                type="tel"
                autoComplete="tel"
                required
              />
            </label>
          </div>
          <div className="create-centre-form__row">
            <label>
              Centre code
              <input name="center_code" type="text" required />
            </label>
            <label>
              City
              <input
                name="city_name"
                type="text"
                autoComplete="address-level2"
                required
              />
            </label>
          </div>
          {error && (
            <p
              className="superadmin-feedback superadmin-feedback--error"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="create-centre-form__actions">
            <button
              className="create-centre-form__cancel"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="create-centre-form__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Add centre"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
