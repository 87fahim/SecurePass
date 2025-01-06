import React, { useEffect } from "react";
import "./Notification.css"; // Optional for styling

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null; // Ensure the notification appears only if there's a message

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="close-notification">&times;</button>
    </div>
  );
};

export default Notification;
