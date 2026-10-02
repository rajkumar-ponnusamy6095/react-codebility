import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./NotificationToast.css";

interface NotificationToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function NotificationToast({
  message,
  onClose,
  duration = 10_000,
}: NotificationToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration]);

  return createPortal(
    <div
      className="notification-toast"
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "80px",
        right: "16px",
        zIndex: 2000,
      }}
    >
      <div className="notification-toast-content">
        <i className="bi bi-check-circle-fill" aria-hidden="true" />
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="notification-toast-close"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div className="notification-toast-progress" aria-hidden="true">
        <div
          className="notification-toast-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>,
    document.body,
  );
}
