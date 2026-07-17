import { useEffect, useState } from "react";
import { Alert } from "react-native";
import bookRequestService from "../services/bookRequestService";
import { BookRequestResponseDTO } from "../models/BookRequest";

export function useMyRequestsViewModel() {
  const [requests, setRequests] = useState<BookRequestResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await bookRequestService.getMyRequests();

      setRequests(response.content);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar suas solicitações.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setLoading(true);

      await bookRequestService.cancelBookRequest(id);

      Alert.alert("Sucesso", "Solicitação cancelada com sucesso.");

      await loadRequests();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cancelar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return {
    requests,
    loading,
    reload: loadRequests,
    handleCancel,
  };
}