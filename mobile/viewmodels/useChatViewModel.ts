import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Message } from "../models/Message";
import { getConversation, sendMessage } from "../services/chatService";

export function useChatViewModel(receiverId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadConversation() {
    if (!receiverId || Number.isNaN(receiverId)) {
      return;
    }

    try {
      setLoading(true);

      const response = await getConversation(receiverId);

      setMessages(response.content);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a conversa.");
    } finally {
      setLoading(false);
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

      await loadConversation();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (receiverId) {
      loadConversation();
    }
  }, [receiverId]);

  return {
    messages,

    message,
    setMessage,

    loading,

    loadConversation,
    handleSendMessage,
  };
}
