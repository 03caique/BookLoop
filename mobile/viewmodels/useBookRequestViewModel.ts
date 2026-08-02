import { useEffect, useState } from "react";
import { Alert } from "react-native";
import bookRequestService from "../services/bookRequestService";
import { BookRequestResponseDTO, BookRequest } from "../models/BookRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useBookRequestViewModel() {
  const [requests, setRequests] = useState<BookRequestResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requestSent, setRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        setError("Usuário não autenticado.");
        return;
      }

      const response = await bookRequestService.findByProponent(Number(userId));

      setRequests(response.content);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar solicitações.");
      Alert.alert("Erro", "Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBook = async (bookId: number, ownerId: number) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const currentUserIdStr = await AsyncStorage.getItem("userId");

      if (!currentUserIdStr) {
        const authError =
          "Você precisa estar autenticado para solicitar um livro.";
        setErrorMessage(authError);
        Alert.alert("Aviso", authError);
        return;
      }

      const requesterId = Number(currentUserIdStr);

      if (requesterId === ownerId) {
        const selfError = "Você não pode solicitar o seu próprio livro!";
        setErrorMessage(selfError);
        Alert.alert("Aviso", selfError);
        return;
      }

      const requestData: BookRequest = {
        bookId: bookId,
        requesterId: requesterId,
      };

      await bookRequestService.createBookRequest(requestData);

      setRequestSent(true);
      Alert.alert(
        "Sucesso",
        "Sua solicitação de livro foi enviada com sucesso!",
      );
    } catch (err: any) {
      if (err.response?.status === 409) {
        const message =
          err.response?.data?.message ?? "Solicitação já enviada.";

        setErrorMessage(message);
        Alert.alert("Aviso", message);
        return;
      }

      console.error("Erro ao solicitar livro:", err);

      const backendError =
        err.response?.data?.message ?? "Não foi possível enviar a solicitação.";

      setErrorMessage(backendError);
      Alert.alert("Erro", backendError);
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
      await loadRequests();
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
      await loadRequests();
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
    requestSent,
    errorMessage,
    handleRequestBook,
    handleAccept,
    handleReject,
    reload: loadRequests,
  };
}
