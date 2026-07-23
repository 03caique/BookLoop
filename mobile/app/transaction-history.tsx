import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { Transaction, TransactionStatus } from "../models/Transaction";
import { useTransactionHistoryViewModel } from "../viewmodels/useTransactionHistoryViewModel";

export default function TransactionHistory() {
  const vm = useTransactionHistoryViewModel();

  const { userId } = useAuth();

  function getOtherUser(transaction: Transaction) {
    return transaction.proponentId === userId
      ? transaction.requesterName
      : transaction.proponentName;
  }

  function getTransactionMessage(transaction: Transaction) {
    const isProponent = transaction.proponentId === userId;

    const otherUser = isProponent
      ? transaction.requesterName
      : transaction.proponentName;

    if (transaction.status === "FINALIZADA") {
      return isProponent
        ? `Você entregou este livro para ${otherUser}`
        : `Você recebeu este livro de ${otherUser}`;
    }

    if (transaction.status === "PENDENTE") {
      return isProponent
        ? `Você deve entregar este livro para ${otherUser}`
        : `Você deve receber este livro de ${otherUser}`;
    }

    if (transaction.status === "CANCELADA") {
      return "Esta transação foi cancelada";
    }

    return "";
  }

  function formatDate(date: string | null) {
    if (!date) {
      return "Data não disponível";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Data não disponível";
    }

    return parsedDate.toLocaleDateString("pt-BR");
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "FINALIZADA":
        return "#2E7D32";

      case "CANCELADA":
        return "#D32F2F";

      case "PENDENTE":
        return "#F9A825";

      default:
        return "#777";
    }
  }

  function getStatusBg(status: string) {
    switch (status) {
      case "FINALIZADA":
        return "#E8F5E9";

      case "CANCELADA":
        return "#FDECEA";

      case "PENDENTE":
        return "#FFF8E1";

      default:
        return "#F0F0F0";
    }
  }

  function getStatusLabel(status: TransactionStatus) {
    switch (status) {
      case "FINALIZADA":
        return "Finalizada";

      case "CANCELADA":
        return "Cancelada";

      case "PENDENTE":
        return "Pendente";

      default:
        return status;
    }
  }

  if (vm.loading) {
    return (
      <LinearGradient
        colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#2E7D32" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color="#2E7D32" />
        </TouchableOpacity>

        <Text style={styles.title}>Histórico</Text>

        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={vm.transactions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="book-open" size={48} color="#81C784" />
            </View>

            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="repeat" size={18} color="#2E7D32" />
                </View>

                <Text style={styles.bookTitle} numberOfLines={1}>
                  {item.bookTitle}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBg(item.status) },
                ]}
              >
                <Text
                  style={[
                    styles.status,
                    {
                      color: getStatusColor(item.status),
                    },
                  ]}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Feather name="user" size={14} color="#81C784" />
              <Text style={styles.text}>{getOtherUser(item)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="arrow-right-circle" size={14} color="#81C784" />
              <Text style={styles.text}>{getTransactionMessage(item)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="calendar" size={14} color="#81C784" />
              <Text style={styles.text}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 40,
    marginBottom: 24,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#C8E6C9",
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E8F5E9",
    marginBottom: 12,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2E7D32",
    flexShrink: 1,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  text: {
    color: "#555",
    marginLeft: 8,
    fontSize: 14,
  },

  status: {
    fontWeight: "700",
    fontSize: 12,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 24,
  },

  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#757575",
    fontSize: 16,
  },
});
