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
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { authenticated } = useAuth();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  const vm = useBooksViewModel("", 5);
  const notificationVm = useNotificationViewModel();

  useEffect(() => {
    if (!authenticated) {
      notificationVm.stopPolling();
      return;
    }

    notificationVm.startPolling();

    return () => {
      notificationVm.stopPolling();
    };
  }, [authenticated]);

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
        colors={[Palette.primary, Palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.appBarTopRow}>
          <Text style={styles.logo}>BookLoop</Text>

          <View style={styles.headerIcons}>
            <View>
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                style={styles.iconButton}
              >
                <Feather name="bell" size={22} color={Palette.secondary} />
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
              <Feather name="user" size={22} color={Palette.secondary} />
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

        {vm.books.map((book) => (
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

  appBarTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg - 2, // 18
  },

  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 140,
  },

  logo: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
  },

  headerIcons: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.white,
    borderRadius: Radius.md,
    paddingLeft: 14,
    paddingRight: Spacing.sm - 2, // 6
    height: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  searchIcon: {
    marginRight: Spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Palette.primaryDark,
  },

  searchButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: Palette.secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Palette.primaryDark,
    marginBottom: Spacing.md,
  },

  viewAllButton: {
    alignSelf: "center",
    backgroundColor: Palette.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radius.md,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  viewAllText: {
    color: Palette.white,
    fontWeight: "600",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: Palette.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },

  badge: {
    position: "absolute",
    right: -4,
    top: -4,
    backgroundColor: Palette.danger,
    borderRadius: Radius.sm,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Palette.white,
  },

  badgeText: {
    color: Palette.white,
    fontSize: FontSize.xs,
    fontWeight: "bold",
  },
});
