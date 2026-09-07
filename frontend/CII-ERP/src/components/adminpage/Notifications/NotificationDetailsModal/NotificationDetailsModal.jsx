import React from "react";
import Modal from "../../shared/Modal/Modal";
import {
  notificationTypeStyles,
  notificationCategoryLabels,
} from "../../../../../api/admin/notificationService";
import "./NotificationDetailsModal.css";

const NotificationDetailsModal = ({ notification, isOpen, onClose }) => {
  if (!notification) return null;

  const Icon = notification.icon;
  const style = notificationTypeStyles[notification.type] ?? {};
  const category = notificationCategoryLabels[notification.type] ?? "UPDATE";

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={480}>
      <span
        className="notification-details-modal__icon"
        style={{ backgroundColor: style.bg }}
      >
        <Icon size={22} color={style.color} strokeWidth={2} />
      </span>

      <span className="notification-details-modal__category">{category}</span>
      <h2 className="notification-details-modal__title">
        {notification.title}
      </h2>
      <p className="notification-details-modal__description">
        {notification.description}
      </p>
      <span className="notification-details-modal__time">
        {notification.time}
      </span>
    </Modal>
  );
};

export default NotificationDetailsModal;
