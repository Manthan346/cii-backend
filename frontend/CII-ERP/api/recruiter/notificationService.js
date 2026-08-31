import {
  BadgeCheck,
  Bell,
  Briefcase,
  Calendar,
  FileText,
  Star,
} from "lucide-react";
import API from "../api.js";

const TYPE_CONFIG = {
  APPLICATION: { type: "application", icon: FileText },
  JOB_APPLICATION: { type: "application", icon: FileText },
  SHORTLISTED: { type: "shortlisted", icon: Star },
  INTERVIEW: { type: "interview", icon: Calendar },
  INTERVIEW_SCHEDULED: { type: "interview", icon: Calendar },
  JOB_OPPORTUNITY: { type: "job-opportunity", icon: Briefcase },
  JOB_POSTING: { type: "job-opportunity", icon: Briefcase },
  JOB_CLOSING: { type: "job-closing", icon: Briefcase },
  OFFER_ACCEPTED: { type: "offer-accepted", icon: BadgeCheck },
};

const formatRelativeTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds >= 7200 ? "s" : ""} ago`;
  return `${Math.floor(seconds / 86400)} day${seconds >= 172800 ? "s" : ""} ago`;
};

export function normalizeRecruiterNotification(notification = {}) {
  const detail = notification.notifications ?? {};
  const notificationType = String(detail.notification_type ?? "").toUpperCase();
  const config = TYPE_CONFIG[notificationType] ?? { type: "update", icon: Bell };

  return {
    id: notification.user_notification_id ?? detail.notification_id,
    type: config.type,
    icon: config.icon,
    title: detail.title ?? "Notification",
    description: detail.notification_message ?? "",
    time: formatRelativeTime(notification.created_at ?? detail.created_at),
    unread: !notification.is_read,
  };
}

export async function fetchRecruiterNotifications(params = {}) {
  const response = await API.get("/hr/notifications", {
    params: { page: 1, limit: 10, ...params },
  });
  const payload = response.data?.data ?? {};
  const notifications = Array.isArray(payload.notifications)
    ? payload.notifications
    : [];

  return {
    notifications: notifications.map(normalizeRecruiterNotification),
    pagination: payload.pagination ?? {},
  };
}
