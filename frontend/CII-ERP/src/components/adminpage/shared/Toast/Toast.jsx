import React, { useEffect } from 'react';
import './Toast.css';

/**
 * Toast
 *
 * Floating confirmation banner - used today for "Request Rejected" /
 * "Approved Successfully" after acting on an Approval Request, and
 * reusable anywhere else a brief success/error confirmation is
 * needed. Auto-dismisses after `duration` ms; renders nothing when
 * `message` is falsy.
 *
 * Props:
 *  - message: string           -> banner text. Falsy hides the toast.
 *  - tone: 'success' | 'danger'
 *  - onDismiss: function       -> called when the toast auto-dismisses
 *  - duration: number          -> ms before auto-dismiss. Defaults to 2500.
 */
const Toast = ({ message, tone = 'success', onDismiss, duration = 2500 }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className="admin-toast__wrap">
      <div className={`admin-toast admin-toast--${tone}`} role="status">
        {message}
      </div>
    </div>
  );
};

export default Toast;
