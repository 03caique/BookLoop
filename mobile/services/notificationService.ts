import api from "./api";
import { Notification } from "../models/Notification";

export async function getNotifications(type?: string) {
  const response = await api.get<Notification[]>("/api/notifications", {
    params: type ? { type } : {},
  });

  return response.data;
}

export async function getUnreadCount() {
  const response = await api.get<number>(
    "/api/notifications/unread-count"
  );

  return response.data;
}

export async function markAsRead(id: number) {
  await api.put(`/api/notifications/${id}/read`);
}