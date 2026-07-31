import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
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
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function Books() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { query } = useLocalSearchParams();

  const { books, search, setSearch, loading, loadBooks } = useBooksViewModel(
    (query as string) || "",
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Palette.primary, Palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
      >
        <Text style={styles.title}>Livros Disponíveis</Text>

        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={18}
            color={Palette.primaryLight}
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Buscar livro ou autor"
            placeholderTextColor={Palette.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <TouchableOpacity style={styles.searchButton} onPress={loadBooks}>
            <Feather name="arrow-right" size={18} color={Palette.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Palette.secondary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
            />
          )}
        />
      )}

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

  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
    marginBottom: Spacing.md,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.white,
    borderRadius: Radius.md,
    paddingLeft: 14,
    paddingRight: 6,
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

  loader: {
    marginTop: Spacing.xl,
  },

  listContent: {
    padding: Spacing.lg,
    paddingBottom: 140,
  },
});