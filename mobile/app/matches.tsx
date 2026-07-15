import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useMatchesViewModel } from "../viewmodels/useMatchesViewModel";

export default function MatchesScreen() {
  const vm = useMatchesViewModel();

  if (vm.loading) {
    return (
      <LinearGradient
        colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#2E7D32" />
      </LinearGradient>
    );
  }

  if (vm.error) {
    return (
      <LinearGradient
        colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
        style={styles.container}
      >
        <Feather name="alert-circle" size={56} color="#E53935" />
        <Text style={styles.errorText}>{vm.error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={vm.refresh}>
          <LinearGradient
            colors={["#2E7D32", "#26A69A"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Feather name="repeat" size={28} color="#2E7D32" />
        <Text style={styles.title}>Matches Ativos</Text>
      </View>

      <FlatList
        data={vm.matches}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={vm.loading}
        onRefresh={vm.refresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={60} color="#A5D6A7" />
            <Text style={styles.emptyText}>
              Nenhum match ativo encontrado.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="users" size={22} color="#2E7D32" />
              <Text style={styles.userName}>
                {item.nomeOutroUsuario}
              </Text>
            </View>

            <View style={styles.exchangeContainer}>
              <View style={styles.bookContainer}>
                <Text style={styles.label}>Seu livro</Text>

                <View style={styles.bookRow}>
                  <Feather
                    name="book-open"
                    size={18}
                    color="#2E7D32"
                  />
                  <Text style={styles.bookName}>
                    {item.livroOferecido}
                  </Text>
                </View>
              </View>

              <Feather
                name="repeat"
                size={26}
                color="#2E7D32"
                style={styles.exchangeIcon}
              />

              <View style={styles.bookContainer}>
                <Text style={styles.label}>
                  Livro de {item.nomeOutroUsuario}
                </Text>

                <View style={styles.bookRow}>
                  <Feather
                    name="book"
                    size={18}
                    color="#26A69A"
                  />
                  <Text style={styles.bookName}>
                    {item.livroDesejado}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.contactButton}>
              <LinearGradient
                colors={["#2E7D32", "#26A69A"]}
                style={styles.buttonGradient}
              >
                <Feather
                  name="message-circle"
                  size={18}
                  color="#FFF"
                />
                <Text style={styles.buttonText}>
                  Entrar em contato
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      />

const styles = StyleSheet.create({
      container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 10,
  },

  list: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    elevation: 3,
    padding: 18,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 8,
  },

  exchangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  bookContainer: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 6,
  },

  bookRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  bookName: {
    marginLeft: 8,
    fontSize: 15,
    color: "#212121",
    flexShrink: 1,
  },

  exchangeIcon: {
    marginHorizontal: 12,
  },

  contactButton: {
    borderRadius: 16,
    overflow: "hidden",
  },

  retryButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
  },

  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 24,
  },

  emptyText: {
    marginTop: 16,
    textAlign: "center",
    color: "#757575",
    fontSize: 16,
  },

  errorText: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#E53935",
    fontSize: 16,
  },
});