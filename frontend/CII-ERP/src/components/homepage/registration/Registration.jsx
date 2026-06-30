import { useFormik } from "formik";
import { useState } from "react";
import "./Registration.css";
import { Link } from "react-router-dom";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      center: "",
      role: "",
      password: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="reg-card">
      <div className="reg-header">
        <h2 className="reg-title">Register</h2>
        <p className="reg-subtitle">Fill in your details to get started</p>
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

        {/* Center */}
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

        {/* Role */}
        {/* <div className="reg-field reg-field-full">
          <label className="reg-label">Role</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <select
              name="role"
              className="reg-select"
              onChange={formik.handleChange}
              value={formik.values.role}
            >
              <option value="">Select your role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Student">Student</option>
              <option value="Accountant">Accountant</option>
              <option value="Hostel Warden">Hostel Warden</option>
            </select>
          </div>
        </div> */}

        {/* Password */}
        <div className="reg-field reg-field-full">
          <label className="reg-label">Password</label>
          <div className="reg-input-wrap">
            <span className="reg-input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="reg-input reg-input-icon-pad reg-input-pw"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <button
              type="button"
              className="reg-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <button type="submit" className="reg-submit-btn">Create Account</button>

        <p className="reg-login-text">
          Already have an account?{" "}
          <Link to="/LoginPage" className="reg-login-link">Login</Link>
        </p>
      </form>
    </div>
  );
}
