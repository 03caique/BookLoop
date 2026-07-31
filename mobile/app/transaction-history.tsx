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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { Transaction, TransactionStatus } from "../models/Transaction";
import { useTransactionHistoryViewModel } from "../viewmodels/useTransactionHistoryViewModel";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function TransactionHistory() {
  const vm = useTransactionHistoryViewModel();
  const insets = useSafeAreaInsets();

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
        return Palette.primaryDark;

      case "CANCELADA":
        return Palette.danger;

      case "PENDENTE":
        return Palette.warning;

      default:
        return Palette.textFaint;
    }
  }

  function getStatusBg(status: string) {
    switch (status) {
      case "FINALIZADA":
        return Palette.successBg;

      case "CANCELADA":
        return Palette.dangerBg;

      case "PENDENTE":
        return Palette.warningBg;

      default:
        return Palette.neutralBg;
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
      <View style={styles.screen}>
        <LinearGradient
          colors={[Palette.primary, Palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
        >
          <Text style={styles.title}>Histórico</Text>
        </LinearGradient>

        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Palette.secondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[Palette.primary, Palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/profile")
            }
          >
            <Feather name="arrow-left" size={22} color={Palette.secondary} />
          </TouchableOpacity>

          <Text style={styles.title}>Histórico</Text>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={vm.transactions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="book-open" size={48} color={Palette.primaryLight} />
            </View>

            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="repeat" size={18} color={Palette.primaryDark} />
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
              <Feather name="user" size={14} color={Palette.primaryLight} />
              <Text style={styles.text}>{getOtherUser(item)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="arrow-right-circle" size={14} color={Palette.primaryLight} />
              <Text style={styles.text}>{getTransactionMessage(item)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="calendar" size={14} color={Palette.primaryLight} />
              <Text style={styles.text}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  appBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.overlay,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Palette.borderLight,
    padding: 18,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 30,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
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
    backgroundColor: Palette.tintLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },

  divider: {
    height: 1,
    backgroundColor: Palette.tintLight,
    marginBottom: Spacing.md,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Palette.primaryDark,
    flexShrink: 1,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  text: {
    color: Palette.textSoft,
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
    paddingHorizontal: Spacing.xl,
  },

  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.tintLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },

  emptyText: {
    textAlign: "center",
    color: Palette.textLabel,
    fontSize: 16,
  },
});