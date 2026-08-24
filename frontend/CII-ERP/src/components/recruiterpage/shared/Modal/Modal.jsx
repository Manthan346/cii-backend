import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Modal (shared)
 *
 * Generic centered overlay dialog: dims the page, renders a white
 * card with a floating circular close (X) button in the top-right
 * corner, and closes on overlay click or Escape. Content-agnostic -
 * callers put their own header/body/footer inside as children.
 *
 * Backs Placement Management's "Add Event" and "Event Details"
 * popups today; reusable anywhere else a modal is needed later.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - children: content to render inside the card
 *  - maxWidth: number (default 640) -> card's max width in px
 */
const Modal = ({ isOpen, onClose, children, maxWidth = 640 }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal__card"
        style={{ maxWidth }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button type="button" className="modal__close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
