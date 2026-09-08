import React, { useEffect, useState } from "react";
import { Copy, Check, KeyRound } from "lucide-react";
import Modal from "../../shared/Modal/Modal";
import Button from "../../shared/Button/Button";
import { changeUserPassword } from "../../../../../api/admin/adminUsersService";
import "./ChangePasswordModal.css";

const MIN_LENGTH = 8;
const MAX_LENGTH = 100;

/**
 * ChangePasswordModal
 *
 * Two-step modal opened from a user row's "Change Password" menu item:
 *  1. "form" — admin types + confirms a new password for the target user
 *  2. "success" — read-only confirmation card showing that user's email
 *     and the password just set, with copy buttons, once the backend
 *     confirms the update
 *
 * The plaintext password is never returned by the backend (it's hashed
 * server-side), so step 2 echoes back what was typed in step 1 rather
 * than anything from the API response.
 *
 * Props:
 *  - isOpen, onClose
 *  - user: { id, name, email } — the target user this menu action was
 *           opened for
 *  - onChanged: optional function() -> called after a successful change,
 *               e.g. to refresh the users list
 */
const ChangePasswordModal = ({ isOpen, onClose, user, onChanged }) => {
  const [step, setStep] = useState("form");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSaving(false);
      setCopiedField(null);
    }
  }, [isOpen, user]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters long`);
      return;
    }
    if (password.length > MAX_LENGTH) {
      setError(`Password must not exceed ${MAX_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await changeUserPassword(user.id, password);
      setStep("success");
      onChanged?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to change the password right now.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // Clipboard API unavailable/blocked — value is still visible on
      // screen for the admin to select and copy manually.
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
      {step === "form" ? (
        <form className="change-password-modal" onSubmit={handleSubmit}>
          <div className="change-password-modal__icon">
            <KeyRound size={20} strokeWidth={2} />
          </div>

          <h2 className="change-password-modal__title">Change Password</h2>
          <p className="change-password-modal__subtitle">
            Set a new password for <strong>{user.name}</strong> ({user.email})
          </p>

          <label className="change-password-modal__field">
            <span>New Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
            />
          </label>

          <label className="change-password-modal__field">
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="change-password-modal__error">{error}</p>}

          <div className="change-password-modal__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Change Password"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="change-password-modal">
          <div className="change-password-modal__icon change-password-modal__icon--success">
            <Check size={20} strokeWidth={2} />
          </div>

          <h2 className="change-password-modal__title">Password Changed</h2>
          <p className="change-password-modal__subtitle">
            Share these new credentials with {user.name}.
          </p>

          <div className="change-password-modal__credential">
            <div>
              <span className="change-password-modal__credential-label">
                Email
              </span>
              <span className="change-password-modal__credential-value">
                {user.email}
              </span>
            </div>
            <button
              type="button"
              className="change-password-modal__copy-btn"
              onClick={() => handleCopy("email", user.email)}
              aria-label="Copy email"
            >
              {copiedField === "email" ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          <div className="change-password-modal__credential">
            <div>
              <span className="change-password-modal__credential-label">
                New Password
              </span>
              <span className="change-password-modal__credential-value">
                {password}
              </span>
            </div>
            <button
              type="button"
              className="change-password-modal__copy-btn"
              onClick={() => handleCopy("password", password)}
              aria-label="Copy password"
            >
              {copiedField === "password" ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          <div className="change-password-modal__actions">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ChangePasswordModal;
