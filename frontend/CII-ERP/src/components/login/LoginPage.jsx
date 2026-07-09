import React, { useState, useRef, useEffect } from "react";
import "./LoginPage.css";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function Dropdown({ id, label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="lp-field-group" style={{ flex: 1, minWidth: 0 }}>
      <label className="lp-label" htmlFor={id}>{label}</label>
      <div className="lp-input-wrap" style={{ position: "relative" }} ref={wrapperRef}>
        <button
          type="button"
          id={id}
          className="lp-input"
          style={{
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "10px",
            paddingLeft: "14px",
          }}
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span style={{ color: selectedOption ? "#1a202c" : "#9ca3af" }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
              flexShrink: 0,
              color: "#9ca3af",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            aria-label={label}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              margin: 0,
              padding: "6px",
              listStyle: "none",
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(6, 25, 74, 0.12)",
              zIndex: 20,
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: isSelected ? "#ffffff" : "#1a202c",
                    background: isSelected ? "#0c2d72" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [center, setCenter] = useState("");

  const centers = ["MUMBAI", "PUNE","DELHI"];

  return (
    <div className="lp-container">
      {/* Left decorative panel */}
      <div className="lp-left">
        <div className="lp-left-inner">
        </div>
      </div>

      {/* Right form panel */}
      <div className="lp-right">
        <div className="lp-form-card">
          <div className="lp-form-header">
            <h1 className="lp-form-title">Welcome Back</h1>
            <p className="lp-form-subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="lp-form">
            <div className="lp-field-group">
              <label className="lp-label">Email Address</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input type="email" placeholder="you@example.com" className="lp-input" />
              </div>
            </div>

            <div className="lp-field-group">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="lp-input lp-input-pw"
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <Dropdown
                id="lp-role-select"
                label="Role"
                placeholder="Select role"
                value={role}
                onChange={setRole}
                options={[
                  { value: "Staff", label: "Staff" },
                  { value: "Admin", label: "Admin" },
                  { value: "Student", label: "Student" },
                ]}
              />

              <Dropdown
                id="lp-center-select"
                label="Center"
                placeholder="Select center"
                value={center}
                onChange={setCenter}
                options={centers.map((c) => ({
                  value: c.id || c.value || c,
                  label: c.name || c.label || c,
                }))}
              />
            </div>

            <div className="lp-forgot-row">
              <a href="#" className="lp-forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="lp-submit-btn">Sign In</button>

            <div className="lp-divider"><span>or continue with</span></div>

            <div className="lp-social-row">
              {/* <button type="button" className="lp-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button> */}
              <button type="button" className="lp-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
            </div>

            <p className="lp-register-text">
              Don't have an account? <Link to="/Registration" className="lp-register-link">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;