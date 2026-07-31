import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontSize, Palette, Radius, Spacing } from "../constants/theme";
import { BookRequestStatus, PriorityLevel } from "../models/BookRequest";
import { useBookRequestViewModel } from "../viewmodels/useBookRequestViewModel";
import { useNotificationViewModel } from "../viewmodels/useNotificationViewModel";

export default function BookRequestsScreen() {
  const vm = useBookRequestViewModel();
  const notificationVm = useNotificationViewModel();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    notificationVm.markAllAsRead();
  }, []);

  const renderStatusColor = (status: BookRequestStatus) => {
    switch (status) {
      case "ACEITA":
        return Palette.primaryDark;
      case "RECUSADA":
        return Palette.danger;
      default:
        return Palette.warning;
    }
  };

  const renderPriorityLevel = (priorityLevel: PriorityLevel | null) => {
    if (!priorityLevel) return null;

    switch (priorityLevel.toUpperCase()) {
      case "ALTA":
        return "Alta prioridade";
      case "MEDIA":
        return "Média prioridade";
      case "BAIXA":
        return "Baixa prioridade";
      default:
        return priorityLevel;
    }
  };

  const getPriorityColors = (priorityLevel: PriorityLevel | null) => {
    if (!priorityLevel) {
      return {
        background: Palette.priorityNeutralBg,
        text: Palette.priorityNeutralText,
        icon: Palette.priorityNeutralText,
      };
    }

    switch (priorityLevel.toUpperCase()) {
      case "ALTA":
        return {
          background: Palette.priorityHighBg,
          text: Palette.priorityHighText,
          icon: Palette.priorityHighText,
        };
      case "MEDIA":
        return {
          background: Palette.priorityMediumBg,
          text: Palette.priorityMediumText,
          icon: Palette.priorityMediumText,
        };
      case "BAIXA":
      default:
        return {
          background: Palette.priorityLowBg,
          text: Palette.priorityLowText,
          icon: Palette.priorityLowText,
        };
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
          <Text style={styles.title}>Solicitações</Text>
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
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
          >
            <Feather name="arrow-left" size={26} color={Palette.white} />
          </TouchableOpacity>

          <Text style={styles.title}>Solicitações</Text>

          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={vm.requests}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma solicitação encontrada.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Feather name="book-open" size={22} color={Palette.primaryDark} />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.book}>{item.bookTitle}</Text>

                <Text style={styles.user}>
                  Solicitado por: {item.requesterName}
                </Text>

                {item.hasSocioeconomicProfile && (
                  <View style={styles.priorityContainer}>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor: getPriorityColors(item.priorityLevel)
                            .background,
                        },
                      ]}
                    >
                      <Feather
                        name="star"
                        size={15}
                        color={getPriorityColors(item.priorityLevel).icon}
                      />

                      <Text
                        style={[
                          styles.priorityText,
                          {
                            color: getPriorityColors(item.priorityLevel).text,
                          },
                        ]}
                      >
                        {renderPriorityLevel(item.priorityLevel)}
                      </Text>
                    </View>
                  </View>
                )}

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
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => vm.handleReject(item.id)}
                  style={styles.rejectButton}
                >
                  <Feather name="x-circle" size={18} color={Palette.white} />

                  <Text style={styles.buttonText}>Recusar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => vm.handleAccept(item.id)}>
                  <LinearGradient
                    colors={[Palette.primaryDark, Palette.acceptAccent]}
                    style={styles.acceptButton}
                  >
                    <Feather
                      name="check-circle"
                      size={18}
                      color={Palette.white}
                    />

                    <Text style={styles.buttonText}>Aceitar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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

  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
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

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  book: {
    fontSize: 18,
    fontWeight: "bold",
    color: Palette.textBody,
  },

  user: {
    marginTop: 4,
    color: Palette.textMutedAlt,
    fontSize: 15,
  },

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
  },

  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.md,
  },

  rejectButton: {
    backgroundColor: Palette.danger,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.md,
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

  priorityContainer: {
    marginTop: 10,
  },

  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },

  priorityText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 30,
  },
});
