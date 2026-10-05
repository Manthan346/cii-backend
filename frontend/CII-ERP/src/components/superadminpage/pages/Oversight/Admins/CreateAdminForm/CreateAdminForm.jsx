import "./CreateAdminForm.css";

export default function CreateAdminForm({ centres, onClose, onCreateAdmin }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onCreateAdmin({
      firstName: String(formData.get("first_name") || "").trim(),
      lastName: String(formData.get("last_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      centreId: String(formData.get("center_id") || ""),
    });
  };

  return (
    <div
      className="create-admin-form__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="create-admin-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-admin-form-title"
      >
        <div className="create-admin-form__header">
          <div>
            <h2 id="create-admin-form-title">Add a centre admin</h2>
            <p>Enter the admin details and choose a centre.</p>
          </div>
          <button
            className="create-admin-form__close"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>
        <form className="create-admin-form__fields" onSubmit={handleSubmit}>
          <div className="create-admin-form__row">
            <label>
              First name
              <input
                name="first_name"
                type="text"
                autoComplete="given-name"
                required
              />
            </label>
            <label>
              Last name
              <input
                name="last_name"
                type="text"
                autoComplete="family-name"
              />
            </label>
          </div>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Centre
            <select name="center_id" defaultValue="" required>
              <option value="" disabled>Select a centre</option>
              {centres.map((centre) => (
                <option key={centre.id} value={centre.id}>
                  {centre.name}
                </option>
              ))}
            </select>
          </label>
          <p className="create-admin-form__note">
            This form is a local preview only. It does not save or send the password.
          </p>
          <div className="create-admin-form__actions">
            <button
              className="create-admin-form__cancel"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="create-admin-form__submit" type="submit">
              Add admin
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
