import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { TransactionCard } from "../models/TransactionCard";
import { matchService } from "../services/matchService";
import { transactionService } from "../services/transactionService";

export function useTransactionsViewModel() {
  const [transactions, setTransactions] = useState<TransactionCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmingTransactionId, setConfirmingTransactionId] = useState<
    number | null
  >(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        setError("Usuário não autenticado.");
        return;
      }

      const [matchData, transactionData] = await Promise.all([
        matchService.findMatchesByUser(Number(userId)),
        transactionService.getMyTransactions(),
      ]);

      const tradeTransactions: TransactionCard[] = matchData.map((match) => ({
        id: match.matchId,

        type: "TROCA",

        otherUserId: match.otherUserId,
        otherUserName: match.otherUserName,

        myBookTitle: match.myBookTitle,

        otherBookTitle: match.otherBookTitle,

        transactionId: match.myTransactionId,

        transactionStatus: match.myTransactionStatus,

        isProponent: true,
      }));

      const loggedUserId = Number(userId);

      const donationTransactions: TransactionCard[] = transactionData
        .filter((transaction) => transaction.type === "DOACAO")
        .map((transaction) => ({
          id: transaction.id,

          type: "DOACAO",

          otherUserId: transaction.otherUserId,
          otherUserName: transaction.otherUserName,

          myBookTitle: transaction.bookTitle,

          transactionId: transaction.id,

          transactionStatus: transaction.status,

          isProponent: transaction.proponentId === loggedUserId,
        }));

      setTransactions([...tradeTransactions, ...donationTransactions]);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as transações.");
      Alert.alert("Erro", "Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

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

                await loadTransactions();
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
    [loadTransactions],
  );

  const refresh = loadTransactions;

  return {
    transactions,
    loading,
    error,
    refresh,
    confirmDelivery,
    confirmingTransactionId,
  };
}
