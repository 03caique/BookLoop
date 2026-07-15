import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { MatchResponseDTO } from "../models/Match";
import { matchService } from "../services/matchService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useMatchesViewModel() {
  const [matches, setMatches] = useState<MatchResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const refresh = loadMatches;

  return {
    matches,
    loading,
    error,
    refresh,
  };
}
