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
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationViewModel } from "../viewmodels/useNotificationViewModel";
import { Notification } from "../models/Notification";

export default function NotificationsScreen() {
  const vm = useNotificationViewModel();

  useEffect(() => {
    vm.loadNotifications();
  }, []);

  const getIcon = (notification: Notification) => {
    if (notification.type === "MATCH_CRIADO") {
      return {
        name: "repeat",
        color: "#00c954",
      };
    }

    return {
      name: "book-open",
      color: "#2E7D32",
    };
  };

  if (vm.loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
          style={styles.container}
        >
          <ActivityIndicator size="large" color="#2E7D32" />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

          <Text style={styles.title}>Notificações</Text>

          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={vm.notifications}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="bell-off" size={50} color="#81C784" />

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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },

  unreadCard: {
    borderWidth: 2,
    borderColor: "#C8E6C9",
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
    color: "#333",
  },

  message: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },

  date: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },

  badge: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    marginTop: 16,
    color: "#757575",
    fontSize: 16,
  },
});
