import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { BookCard } from "../components/BookCard";
import { BottomNavigation } from "../components/BottomNavigation";
import { useBooksViewModel } from "../viewmodels/useBooksViewModel";

export default function Books() {
  const router = useRouter();

  const { query } = useLocalSearchParams();

  const { books, search, setSearch, loading, loadBooks } = useBooksViewModel(
    (query as string) || "",
  );

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.container}
    >
      <Text style={styles.title}>Livros</Text>

      <TextInput
        placeholder="Buscar livro ou autor"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={loadBooks}>
        <Text style={styles.buttonText}>BUSCAR</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
            />
          )}
        />
      )}

      <BottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },

  button: {
    backgroundColor: "#26a69a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
