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
import { BookRequestStatus } from "../models/BookRequest";
import { useMyRequestsViewModel } from "../viewmodels/useMyRequestsViewModel";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function MyRequestsScreen() {
  const vm = useMyRequestsViewModel();
  const insets = useSafeAreaInsets();

  const renderStatusColor = (status: BookRequestStatus) => {
    switch (status) {
      case "ACEITA":
        return Palette.primaryDark;
      case "RECUSADA":
        return Palette.danger;
      case "CANCELADA":
        return Palette.textLabel;
      default:
        return Palette.warning;
    }
  };

  if (vm.loading) {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={[Palette.primary, Palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
        >
          <Text style={styles.title}>Minhas solicitações</Text>
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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/profile");
              }
            }}
          >
            <Feather name="arrow-left" size={26} color={Palette.white} />
          </TouchableOpacity>

          <Text style={styles.title}>Minhas solicitações</Text>

          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={vm.requests}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Você ainda não realizou nenhuma solicitação.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Feather name="book-open" size={22} color={Palette.primaryDark} />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.book}>{item.bookTitle}</Text>

                <Text
                  style={[
                    styles.status,
                    { color: renderStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {item.status === "PENDENTE" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => vm.handleCancel(item.id)}
              >
                <Feather name="x-circle" size={18} color={Palette.white} />

                <Text style={styles.buttonText}>Cancelar solicitação</Text>
              </TouchableOpacity>
            )}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    padding: 18,
    marginBottom: 18,
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 30,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  book: {
    fontSize: 18,
    fontWeight: "bold",
    color: Palette.textBody,
  },

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  cancelButton: {
    marginTop: Spacing.lg,
    backgroundColor: Palette.danger,
    borderRadius: Radius.md,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: Palette.white,
    fontWeight: "bold",
    marginLeft: 8,
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: Palette.textMutedAlt,
    fontSize: 16,
  },
});
