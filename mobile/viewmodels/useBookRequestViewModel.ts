import {useEffect, useState} from "react";
import {Alert} from "react-native";
import bookRequestService from "../services/bookRequestService";
import {BookRequestResponseDTO} from "../models/BookRequest";

export function useBookRequestsViewModel(){
  const [requests, setRequests] = useState<BookRequestResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const proponentId = 1;

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookRequestService.findByProponent(proponentId);

      setRequests(response.content);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar solicitações.");
      Alert.alert("Erro", "Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      setLoading(true);

      await bookRequestService.updateStatus(id, "ACEITA");

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: "ACEITA" }
            : request
        )
      );

      Alert.alert("Sucesso", "Solicitação aceita com sucesso.");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível aceitar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setLoading(true);

      await bookRequestService.updateStatus(id, "RECUSADA");

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: "RECUSADA" }
            : request
        )
      );

      Alert.alert("Sucesso", "Solicitação recusada com sucesso.");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível recusar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    error,
    handleAccept,
    handleReject,
    reload: loadRequests,
  };
}