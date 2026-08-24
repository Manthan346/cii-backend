import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal
 * Generic overlay + centered card wrapper. Content-agnostic — pass
 * whatever you like as children.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void — called on backdrop click or Escape key
 *  - children: ReactNode
 *  - width: optional CSS width for the card (default 480px)
 */
export default function Modal({ isOpen, onClose, children, width = 480 }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mp-modal-backdrop" onMouseDown={onClose}>
      <div
        className="mp-modal-card"
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
