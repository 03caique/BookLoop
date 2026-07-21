import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Message } from "../models/Message";
import {
  getConversation,
  getNewMessages,
  sendMessage,
} from "../services/chatService";

export function useChatViewModel(receiverId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<string | null>(null);

  const lastMessageTimeRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function sortByDate(list: Message[]) {
    return [...list].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
    );
  }

  function dedupeById(list: Message[]) {
    return list.filter(
      (message, index, self) =>
        index === self.findIndex((item) => item.id === message.id),
    );
  }

  function updateLastMessageTime(list: Message[]) {
    if (list.length === 0) {
      return;
    }

    const lastMessage = list[list.length - 1];

    lastMessageTimeRef.current = lastMessage.sentAt;
    setLastMessageTime(lastMessage.sentAt);
  }

  async function loadConversation() {
    if (!receiverId || Number.isNaN(receiverId)) {
      return;
    }

    try {
      setLoading(true);

      const response = await getConversation(receiverId);
      const sorted = sortByDate(response.content);

      setMessages(sorted);
      updateLastMessageTime(sorted);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a conversa.");
    } finally {
      setLoading(false);
    }
  }

  async function loadNewMessages() {
    if (!receiverId) {
      return;
    }

    try {
      // Caso a conversa ainda não tenha mensagens carregadas
      if (!lastMessageTimeRef.current) {
        const response = await getConversation(receiverId);

        if (response.content.length > 0) {
          const sorted = sortByDate(response.content);

          setMessages(sorted);
          updateLastMessageTime(sorted);
        }

        return;
      }

      // Caso já tenha mensagens, busca somente as novas
      const newMessages = await getNewMessages(
        receiverId,
        lastMessageTimeRef.current,
      );

      if (newMessages.length > 0) {
        setMessages((prev) => {
          const merged = sortByDate(dedupeById([...prev, ...newMessages]));

          updateLastMessageTime(merged);

          return merged;
        });
      }
    } catch (error) {
      console.error("Erro ao buscar novas mensagens:", error);
    }
  }

  function startPolling() {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      loadNewMessages();
    }, 5000);
  }

  function stopPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function handleSendMessage() {
    if (!receiverId || Number.isNaN(receiverId)) {
      return;
    }
    if (!message.trim()) {
      Alert.alert("Atenção", "Digite uma mensagem.");
      return;
    }

    try {
      setLoading(true);

      const content = message.trim();

      setMessage("");

      await sendMessage(receiverId, content);

      await loadNewMessages();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (receiverId) {
      loadConversation();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [receiverId]);

  return {
    messages,

    message,
    setMessage,

    loading,

    loadConversation,
    handleSendMessage,

    startPolling,
    stopPolling,
  };
}
