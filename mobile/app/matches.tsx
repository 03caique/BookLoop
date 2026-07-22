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
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "../components/BottomNavigation";
import { useMatchesViewModel } from "../viewmodels/useMatchesViewModel";

export default function MatchesScreen() {
  const vm = useMatchesViewModel();

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

  if (vm.error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
          style={styles.container}
        >
          <View style={styles.errorCard}>
            <Feather name="alert-circle" size={56} color="#E53935" />
            <Text style={styles.errorText}>{vm.error}</Text>

            <TouchableOpacity style={styles.retryButton} onPress={vm.refresh}>
              <LinearGradient
                colors={["#66BB6A", "#26A69A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Tentar novamente</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/home");
              }
            }}
          >
            <Feather name="arrow-left" size={22} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.title}>Matches Ativos</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={vm.matches}
          keyExtractor={(item) => item.matchId.toString()}
          contentContainerStyle={styles.list}
          refreshing={vm.loading}
          onRefresh={vm.refresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="heart" size={48} color="#81C784" />
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
                  <Feather name="users" size={20} color="#2E7D32" />
                </View>
                <Text style={styles.userName}>{item.otherUserName}</Text>
              </View>

              <View style={styles.exchangeContainer}>
                <View style={styles.bookBox}>
                  <Text style={styles.label}>Seu livro</Text>

                  <View style={styles.bookRow}>
                    <Feather name="book-open" size={16} color="#2E7D32" />
                    <Text style={styles.bookName} numberOfLines={2}>
                      {item.myBookTitle}
                    </Text>
                  </View>
                </View>

                <View style={styles.exchangeIconCircle}>
                  <Feather name="repeat" size={20} color="#FFF" />
                </View>

                <View style={styles.bookBox}>
                  <Text style={styles.label}>
                    Livro de {item.otherUserName}
                  </Text>

                  <View style={styles.bookRow}>
                    <Feather name="book" size={16} color="#26A69A" />
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
                  colors={["#66BB6A", "#26A69A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Feather name="message-circle" size={18} color="#FFF" />
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
                    colors={["#66BB6A", "#26A69A"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {vm.confirmingTransactionId === item.myTransactionId ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Feather name="check-circle" size={18} color="#FFF" />
                        <Text style={styles.buttonText}>Confirmar entrega</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.deliveredContainer}>
                  <Feather name="check-circle" size={18} color="#2E7D32" />
                  <Text style={styles.deliveredText}>Entrega confirmada</Text>
                </View>
              )}
            </View>
          )}
        />

        <BottomNavigation />
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
    marginTop: 12,
    marginBottom: 24,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  list: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#C8E6C9",
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  userName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  exchangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  bookBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#C8E6C9",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  label: {
    fontSize: 12,
    color: "#757575",
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
    color: "#212121",
    flexShrink: 1,
  },

  exchangeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#66BB6A",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  contactButton: {
    borderRadius: 16,
    overflow: "hidden",
  },

  errorCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  retryButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },

  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 24,
  },

  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#757575",
    fontSize: 16,
  },

  errorText: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#E53935",
    fontSize: 16,
  },

  deliveredContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 10,
  },

  deliveredText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },

  confirmButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
  },
});
