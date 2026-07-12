import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useBookRequestsViewModel } from "../viewmodels/useBookRequestsViewModel";

export default function BookRequestsScreen() {
  const vm = useBookRequestsViewModel();

  const renderStatusColor = (status: string) => {
    switch (status) {
      case "ACEITA":
        return "#2E7D32";
      case "RECUSADA":
        return "#D32F2F";
      default:
        return "#F9A825";
    }
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
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#2E7D32" />
          </TouchableOpacity>

          <Text style={styles.title}>Solicitações</Text>

          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={vm.requests}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nenhuma solicitação encontrada.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Feather name="book-open" size={22} color="#2E7D32" />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.book}>
                    {item.bookTitle}
                  </Text>

                  <Text style={styles.user}>
                    Solicitado por: {item.requesterName}
                  </Text>

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
                    <Feather
                      name="x-circle"
                      size={18}
                      color="#FFF"
                    />

                    <Text style={styles.buttonText}>
                      Recusar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => vm.handleAccept(item.id)}
                  >
                    <LinearGradient
                      colors={["#2E7D32", "#43A047"]}
                      style={styles.acceptButton}
                    >
                      <Feather
                        name="check-circle"
                        size={18}
                        color="#FFF"
                      />

                      <Text style={styles.buttonText}>
                        Aceitar
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    elevation: 3,
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
    color: "#333",
  },

  user: {
    marginTop: 4,
    color: "#666",
    fontSize: 15,
  },

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },

  rejectButton: {
    backgroundColor: "#D32F2F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
    fontSize: 16,
  },
});