import { useCallback, useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { Notification } from "../models/Notification";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../services/notificationService";

export function useNotificationViewModel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();

      setUnreadCount(count);
    } catch (error) {
      console.error("Erro ao buscar contador de notificações:", error);
    }
  }, []);

  const startPolling = useCallback(async () => {
    if (intervalRef.current) {
      return;
    }

    await loadNotifications();
    await loadUnreadCount();

    intervalRef.current = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 10000);
  }, [loadNotifications, loadUnreadCount]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      try {
        if (!notification.read) {
          await markAsRead(notification.id);

          setNotifications((prev) =>
            prev.map((item) =>
              item.id === notification.id ? { ...item, read: true } : item,
            ),
          );

          await loadUnreadCount();
        }

        if (
          notification.type === "SOLICITACAO_RECEBIDA" ||
          notification.type === "SOLICITACAO_ACEITA"
        ) {
          router.push("/book-requests");
        } else if (notification.type === "MATCH_CRIADO") {
          router.push("/transactions");
        } else if (notification.type === "TRANSACAO_FINALIZADA") {
          router.push("/transaction-history");
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível abrir a notificação.");
      }
    },
    [loadUnreadCount],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const data = await getNotifications();

      const unreadNotifications = data.filter(
        (notification) => !notification.read,
      );

      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }

      await loadUnreadCount();
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  }, [loadUnreadCount]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    loadUnreadCount,
    startPolling,
    stopPolling,
    handleNotificationPress,
    markAllAsRead,
  };
}
