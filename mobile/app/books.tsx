import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { LinearGradient }
from "expo-linear-gradient";

import { useBooksViewModel }
from "../viewmodels/useBooksViewModel";

import { useRouter } from "expo-router";

export default function Books() {

  const {
    books,

    search,
    setSearch,

    loading,

    loadBooks,
  } = useBooksViewModel();

  const router = useRouter();

  return (

    <LinearGradient
      colors={[
        "#E8F5E9",
        "#F1F8E9",
        "#FFFFFF",
      ]}
      style={styles.container}
    >

      <Text style={styles.title}>
        Livros
      </Text>

      <TextInput
        placeholder="Buscar livro ou autor"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={loadBooks}
      >

        <Text style={styles.buttonText}>
          BUSCAR
        </Text>

      </TouchableOpacity>

      {loading ? (

        <ActivityIndicator size="large" />

      ) : (

        <FlatList
          data={books}
          keyExtractor={(item) =>
            item.id!.toString()
          }

          renderItem={({ item }) => (

            <TouchableOpacity style={styles.card} onPress={() => router.push(`/book/${item.id}`)}>

              <Text style={styles.bookTitle}>
                {item.title}
              </Text>

              <Text>
                Autor: {item.author}
              </Text>

              <Text>
                ISBN: {item.isbn}
              </Text>

              <Text>
                Para: {
                  item.status === "DOACAO"
                    ? "Doação"
                    : "Troca"
                }
              </Text>

              <Text>
                Dono: {item.userName}
              </Text>

            </TouchableOpacity>
          )}
        />
      )}
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
    backgroundColor: "#26A69A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
  },

  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2E7D32",
  },
});