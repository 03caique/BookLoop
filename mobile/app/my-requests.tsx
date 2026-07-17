import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
import { BookRequestStatus } from "../models/BookRequest";
import { useMyRequestsViewModel } from "../viewmodels/useMyRequestsViewModel";

export default function MyRequestsScreen() {
  const vm = useMyRequestsViewModel();

  const renderStatusColor = (status: BookRequestStatus) => {
    switch (status) {
      case "ACEITA":
        return "#2E7D32";
      case "RECUSADA":
        return "#D32F2F";
      case "CANCELADA":
        return "#757575";
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

          <Text style={styles.title}>Minhas solicitações</Text>

          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={vm.requests}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Você ainda não realizou nenhuma solicitação.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Feather name="book-open" size={22} color="#2E7D32" />

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
                  <Feather name="x-circle" size={18} color="#FFF" />

                  <Text style={styles.buttonText}>
                    Cancelar solicitação
                  </Text>
                </TouchableOpacity>
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

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  cancelButton: {
    marginTop: 20,
    backgroundColor: "#D32F2F",
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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