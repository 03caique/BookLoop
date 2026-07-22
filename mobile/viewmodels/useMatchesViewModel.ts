import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { MatchResponseDTO } from "../models/Match";
import { matchService } from "../services/matchService";
import { transactionService } from "../services/transactionService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useMatchesViewModel() {
  const [matches, setMatches] = useState<MatchResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmingTransactionId, setConfirmingTransactionId] = useState<
    number | null
  >(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        setError("Usuário não autenticado.");
        return;
      }

      const data = await matchService.findMatchesByUser(Number(userId));

      setMatches(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os matches.");
      Alert.alert("Erro", "Não foi possível carregar os matches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const confirmDelivery = useCallback(
    (transactionId: number) => {
      Alert.alert(
        "Confirmar entrega",
        "Você confirma que o livro foi entregue ao requisitante?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: async () => {
              try {
                setConfirmingTransactionId(transactionId);

                await transactionService.confirmDelivery(transactionId);

                Alert.alert(
                  "Entrega confirmada",
                  "A entrega do livro foi confirmada com sucesso.",
                );

                await loadMatches();
              } catch (err) {
                console.error(err);

                Alert.alert(
                  "Erro",
                  "Não foi possível confirmar a entrega do livro.",
                );
              } finally {
                setConfirmingTransactionId(null);
              }
            },
          },
        ],
      );
    },
    [loadMatches],
  );

  const refresh = loadMatches;

  return {
    matches,
    loading,
    error,
    refresh,
    confirmDelivery,
    confirmingTransactionId,
  };
}
