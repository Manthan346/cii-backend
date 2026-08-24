import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal
 *
 * Generic centered overlay dialog - used today for the Approval
 * Requests "Request detail" popup, and reusable for any future
 * admin confirmation/detail dialog. Closes on backdrop click or
 * Escape. Renders nothing when `isOpen` is false.
 *
 * This intentionally has no built-in header/footer/close-button
 * chrome - callers own the entire panel's content, since different
 * dialogs (request detail, confirmations, forms, ...) all look
 * different. Wrap your own card markup as `children`.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - children: ReactNode
 *  - maxWidth: string -> CSS max-width for the panel. Defaults to '520px';
 *              pass a larger value (e.g. '760px') for wider content like
 *              EditProfileModal's multi-column form.
 */
const Modal = ({ isOpen, onClose, children, maxWidth = '520px' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal__overlay" onClick={onClose}>
      <div
        className="admin-modal__panel"
        role="dialog"
        aria-modal="true"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
