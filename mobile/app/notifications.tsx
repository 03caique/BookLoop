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
import { useNotificationViewModel } from "../viewmodels/useNotificationViewModel";
import { Notification } from "../models/Notification";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function NotificationsScreen() {
  const vm = useNotificationViewModel();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    vm.startPolling();

    return () => {
      vm.stopPolling();
    };
  }, [vm.startPolling, vm.stopPolling]);

  const getIcon = (notification: Notification) => {
    if (notification.type === "MATCH_CRIADO") {
      return {
        name: "repeat",
        color: Palette.matchAccent,
      };
    }

    return {
      name: "book-open",
      color: Palette.primaryDark,
    };
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
          <Text style={styles.title}>Notificações</Text>
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
              router.canGoBack() ? router.back() : router.replace("/")
            }
          >
            <Feather name="arrow-left" size={22} color={Palette.secondary} />
          </TouchableOpacity>

          <Text style={styles.title}>Notificações</Text>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={vm.notifications}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={50} color={Palette.primaryLight} />

            <Text style={styles.emptyText}>
              Nenhuma notificação encontrada.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const icon = getIcon(item);

          return (
            <TouchableOpacity
              onPress={() => vm.handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.card, !item.read && styles.unreadCard]}>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: icon.color + "20",
                      },
                    ]}
                  >
                    <Feather
                      name={icon.name as any}
                      size={24}
                      color={icon.color}
                    />
                  </View>

                  <View style={styles.content}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>

                    <Text style={styles.message}>{item.message}</Text>

                    <Text style={styles.date}>
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>

                  {!item.read && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Nova</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
    alignItems: "center",
    justifyContent: "space-between",
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

  list: {
    padding: Spacing.lg,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    padding: 18,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  unreadCard: {
    borderWidth: 2,
    borderColor: Palette.borderLight,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  notificationTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: Palette.textBody,
  },

  message: {
    marginTop: 5,
    fontSize: 14,
    color: Palette.textMutedAlt,
  },

  date: {
    marginTop: 8,
    fontSize: 12,
    color: Palette.textMuted,
  },

  badge: {
    backgroundColor: Palette.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },

  badgeText: {
    color: Palette.white,
    fontSize: 11,
    fontWeight: "bold",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: Spacing.md,
    color: Palette.textLabel,
    fontSize: 16,
  },
});