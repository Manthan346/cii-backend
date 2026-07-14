import { useFormik } from "formik";
import "./EnquiryForm.css";

const educationOptions = [
  "10th",
  "12th",
  "Graduate",
  "Post Graduate",
  "ITI",
  "Diploma",
];

const courseOptions = [
  "Blue Star",
  "ITC",
  "Cosmos Creative Academy",
  "NASSCOM - DSCI",
  "PSIPL - Kalpataru",
  "Nihon Edutech",
  "Apparel",
  "Bajaj Finserv",
  "Jubilant Food Works",
  "L'Oreal",
  "Cisco",
  "VFS Global",
];

export default function EnquiryForm() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      location: "",
      center: "",
      education: "",
      course: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="reg-card">
      <div className="reg-header">
        <h2 className="reg-title">Course Enquiry</h2>
        <p className="reg-subtitle">Fill in your details and we'll get back to you</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="reg-form">

        {/* Name row */}
        <div className="reg-row">
          <div className="reg-field">
            <label className="reg-label">First Name</label>
            <input
              name="firstName"
              type="text"
              placeholder="First name"
              className="reg-input"
              onChange={formik.handleChange}
              value={formik.values.firstName}
            />
          </div>
          <div className="reg-field">
            <label className="reg-label">Last Name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Last name"
              className="reg-input"
              onChange={formik.handleChange}
              value={formik.values.lastName}
            />
          </div>
        </div>

        {/* Email */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Email Address</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="reg-input reg-input-icon-pad"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Mobile Number</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </span>
            <input
              name="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              className="reg-input reg-input-icon-pad"
              onChange={formik.handleChange}
              value={formik.values.mobile}
            />
          </div>
        </div>

        {/* Location */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Location</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <input
              name="location"
              type="text"
              placeholder="Your city / location"
              className="reg-input reg-input-icon-pad"
              onChange={formik.handleChange}
              value={formik.values.location}
            />
          </div>
        </div>

        {/* Centre */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Centre</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            <input
              name="center"
              type="text"
              placeholder="Your centre name"
              className="reg-input reg-input-icon-pad"
              onChange={formik.handleChange}
              value={formik.values.center}
            />
          </div>
        </div>

        {/* Education */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Education</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
                <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>
              </svg>
            </span>
            <select
              name="education"
              className="reg-select"
              onChange={formik.handleChange}
              value={formik.values.education}
            >
              <option value="">Select your education</option>
              {educationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Course</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </span>
            <select
              name="course"
              className="reg-select"
              onChange={formik.handleChange}
              value={formik.values.course}
            >
              <option value="">Select a course</option>
              {courseOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="reg-submit-btn">Submit Enquiry</button>
      </form>
    </div>
  );
}
