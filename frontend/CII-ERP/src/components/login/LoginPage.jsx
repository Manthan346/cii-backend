import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="left-panel">
        <h2>Welcoming Image</h2>
      </div>

      <div className="right-panel">
        <img
          src={logo}
          alt="CII Logo"
          className="logo"
        />

        <h1>Welcome Back</h1>
        <p>Please Login to your account</p>

        <form>
          <input type="email" placeholder="Email" className="input-field" />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              <VisibilityIcon/>
            </span>
          </div>

          <div className="forgot-password">
            <a href="/">Forgot Password</a>
          </div>

          <button type="submit" className="login-btn">Login</button>

          <div className="divider">
            <span>or login with</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn">
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" width="18" />
              Facebook
            </button>
            <button type="button" className="social-btn google-btn">
              <img src="https://www.google.com/favicon.ico" alt="Google" width="18" />
              Google
            </button>
          </div>

          <p className="signup-text">
            Don't have an account?  <Link to="/Registration">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
