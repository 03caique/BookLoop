import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavigation } from "../components/BottomNavigation";
import { useMatchesViewModel } from "../viewmodels/useMatchesViewModel";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function MatchesScreen() {
  const vm = useMatchesViewModel();
  const insets = useSafeAreaInsets();

  if (vm.loading) {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={[Palette.primary, Palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
        >
          <Text style={styles.title}>Matches Ativos</Text>
        </LinearGradient>

        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Palette.secondary} />
        </View>
      </View>
    );
  }

  if (vm.error) {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={[Palette.primary, Palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
        >
          <Text style={styles.title}>Matches Ativos</Text>
        </LinearGradient>

        <View style={styles.centerContent}>
          <View style={styles.errorCard}>
            <Feather name="alert-circle" size={56} color={Palette.error} />
            <Text style={styles.errorText}>{vm.error}</Text>

            <TouchableOpacity style={styles.retryButton} onPress={vm.refresh}>
              <LinearGradient
                colors={[Palette.primary, Palette.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Tentar novamente</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
        <Text style={styles.title}>Matches Ativos</Text>
      </LinearGradient>

      <FlatList
        data={vm.matches}
        keyExtractor={(item) => item.matchId.toString()}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        refreshing={vm.loading}
        onRefresh={vm.refresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="heart" size={48} color={Palette.primaryLight} />
            </View>
            <Text style={styles.emptyText}>
              Nenhum match ativo encontrado.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarCircle}>
                <Feather name="users" size={20} color={Palette.primaryDark} />
              </View>
              <Text style={styles.userName}>{item.otherUserName}</Text>
            </View>

            <View style={styles.exchangeContainer}>
              <View style={styles.bookBox}>
                <Text style={styles.label}>Seu livro</Text>

                <View style={styles.bookRow}>
                  <Feather name="book-open" size={16} color={Palette.primaryDark} />
                  <Text style={styles.bookName} numberOfLines={2}>
                    {item.myBookTitle}
                  </Text>
                </View>
              </View>

              <View style={styles.exchangeIconCircle}>
                <Feather name="repeat" size={20} color={Palette.white} />
              </View>

              <View style={styles.bookBox}>
                <Text style={styles.label}>
                  Livro de {item.otherUserName}
                </Text>

                <View style={styles.bookRow}>
                  <Feather name="book" size={16} color={Palette.secondary} />
                  <Text style={styles.bookName} numberOfLines={2}>
                    {item.otherBookTitle}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: {
                    receiverId: item.otherUserId.toString(),
                    receiverName: item.otherUserName,
                  },
                })
              }
            >
              <LinearGradient
                colors={[Palette.primary, Palette.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Feather name="message-circle" size={18} color={Palette.white} />
                <Text style={styles.buttonText}>Entrar em contato</Text>
              </LinearGradient>
            </TouchableOpacity>
            {item.myTransactionStatus === "PENDENTE" ? (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => vm.confirmDelivery(item.myTransactionId)}
                disabled={vm.confirmingTransactionId === item.myTransactionId}
              >
                <LinearGradient
                  colors={[Palette.primary, Palette.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {vm.confirmingTransactionId === item.myTransactionId ? (
                    <ActivityIndicator size="small" color={Palette.white} />
                  ) : (
                    <>
                      <Feather name="check-circle" size={18} color={Palette.white} />
                      <Text style={styles.buttonText}>Confirmar entrega</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.deliveredContainer}>
                <Feather name="check-circle" size={18} color={Palette.primaryDark} />
                <Text style={styles.deliveredText}>Entrega confirmada</Text>
              </View>
            )}
          </View>
        )}
      />

      <BottomNavigation />
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

  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 140,
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Palette.borderLight,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.tintLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  userName: {
    fontSize: 17,
    fontWeight: "bold",
    color: Palette.primaryDark,
  },

  exchangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  bookBox: {
    flex: 1,
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Palette.borderLight,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  label: {
    fontSize: 12,
    color: Palette.textLabel,
    marginBottom: 6,
  },

  bookRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  bookName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textPrimary,
    flexShrink: 1,
  },

  exchangeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  contactButton: {
    borderRadius: Radius.md,
    overflow: "hidden",
  },

  errorCard: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    paddingVertical: 32,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    width: "100%",
  },

  retryButton: {
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    overflow: "hidden",
    width: "100%",
  },

  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: Radius.md,
  },

  buttonText: {
    color: Palette.white,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
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

  errorText: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: "center",
    color: Palette.error,
    fontSize: 16,
  },

  deliveredContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.tintLight,
    borderRadius: Radius.md,
    paddingVertical: 16,
    marginTop: 10,
  },

  deliveredText: {
    color: Palette.primaryDark,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },

  confirmButton: {
    borderRadius: Radius.md,
    overflow: "hidden",
    marginTop: 10,
  },
});