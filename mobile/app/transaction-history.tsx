import{ Feather}from "@expo/vector-icons";
import{ LinearGradient }from "expo-linear-gradient";
import{ router }from "expo-router";
import{
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
}from "react-native";

import{ BottomNavigation }from "../components/BottomNavigation";
import{ Transaction }from "../models/Transaction";
import{ useAuth }from "../contexts/AuthContext";
import{ useTransactionHistoryViewModel }from "../viewmodels/useTransactionHistoryViewModel";

export default function TransactionHistory() {

  const vm = useTransactionHistoryViewModel();

  const { userId } = useAuth();

  function getOtherUser(
    transaction: Transaction
  ) {

    return transaction.proponentId === userId
      ? transaction.requesterName
      : transaction.proponentName;
  }

  function getUserRole(
    transaction: Transaction
  ) {

    return transaction.proponentId === userId
      ? "Entregou"
      : "Recebeu";
  }

  function formatDate(date: string) {

    return new Date(date)
      .toLocaleDateString("pt-BR");
  }

  function getStatusColor(status: string) {

    switch (status) {

      case "CONCLUIDA":
        return "#2E7D32";

      case "CANCELADA":
        return "#D32F2F";

      case "EM_ANDAMENTO":
        return "#F9A825";

      default:
        return "#777";
    }
  }

  if (vm.loading) {

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (

    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.container}
    >

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Feather
            name="arrow-left"
            size={28}
            color="#2E7D32"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Histórico
        </Text>

        <View style={{ width: 28 }} />

      </View>

      <FlatList
        data={vm.transactions}
        keyExtractor={(item) =>
          item.id.toString()
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather
              name="book-open"
              size={60}
              color="#BDBDBD"
            />

            <Text style={styles.emptyText}>
              Nenhuma transação encontrada
            </Text>
          </View>
        }
        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.cardHeader}>

              <Feather
                name="repeat"
                size={22}
                color="#2E7D32"
              />

              <Text
                style={[
                  styles.status,
                  {
                    color: getStatusColor(
                      item.status
                    ),
                  },
                ]}
              >
                {item.status}
              </Text>

            </View>

            <Text style={styles.bookTitle}>
              {item.bookTitle}
            </Text>

            <Text style={styles.text}>
              Usuário: {getOtherUser(item)}
            </Text>

            <Text style={styles.text}>
              Ação: {getUserRole(item)}
            </Text>

            <Text style={styles.text}>
              Data: {formatDate(item.createdAt)}
            </Text>

          </View>

        )}
      />

      <BottomNavigation />

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
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  bookTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 12,
  },

  text: {
    color: "#555",
    marginBottom: 4,
  },

  status: {
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: 12,
    color: "#777",
    fontSize: 16,
  },

}
);


