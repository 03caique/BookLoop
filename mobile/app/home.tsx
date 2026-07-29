import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookCard } from "../components/BookCard";
import { BottomNavigation } from "../components/BottomNavigation";
import { useBooksViewModel } from "../viewmodels/useBooksViewModel";
import { useNotificationViewModel } from "../viewmodels/useNotificationViewModel";

export default function Home() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  const vm = useBooksViewModel();
  const notificationVm = useNotificationViewModel();

  useEffect(() => {
    notificationVm.startPolling();

    return () => {
      notificationVm.stopPolling();
    };
  }, []);

  if (vm.loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#66BB6A", "#26A69A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.appBarTopRow}>
          <Text style={styles.logo}>BookLoop</Text>

          <View style={styles.headerIcons}>
            <View>
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                style={styles.iconButton}
              >
                <Feather name="bell" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              {notificationVm.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationVm.unreadCount}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={styles.iconButton}
            >
              <Feather name="user" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={18}
            color="#81C784"
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Buscar livro ou autor"
            placeholderTextColor="#9E9E9E"
            value={vm.search}
            onChangeText={vm.setSearch}
            style={styles.searchInput}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push(`/books?query=${vm.search}`)}
          >
            <Feather name="arrow-right" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Livros Recentes</Text>

        {vm.books.slice(0, 5).map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPress={() => router.push(`/book/${book.id}`)}
          />
        ))}

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/books")}
        >
          <Text style={styles.viewAllText}>Ver Todos</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF8",
  },

  appBar: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  appBarTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 140,
  },

  logo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 6,
    height: 50,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#2E7D32",
  },

  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#26a69a",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 16,
  },

  viewAllButton: {
    alignSelf: "center",
    backgroundColor: "#26a69a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 10,
  },

  viewAllText: {
    color: "#FFF",
    fontWeight: "600",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    height: 70,

    backgroundColor: "#FFF",

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },

  badge: {
    position: "absolute",
    right: -4,
    top: -4,
    backgroundColor: "#D32F2F",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});