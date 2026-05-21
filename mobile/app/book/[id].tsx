import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useLocalSearchParams }
from "expo-router";

import { LinearGradient }
from "expo-linear-gradient";

import { useBookDetailsViewModel }
from "../../viewmodels/useBookDetailsViewModel";

import { TouchableOpacity }
from "react-native";

import { useBookRequestViewModel }
from "../../viewmodels/useBookRequestViewModel";

export default function BookDetails() {

  const { requestSent, errorMessage, handleRequestBook,} = useBookRequestViewModel();

  const { id } = useLocalSearchParams();

  const {
    book,
    loading,
  } = useBookDetailsViewModel(
    Number(id)
  );

  if (loading) {

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!book) {

    return (
      <View style={styles.loadingContainer}>
        <Text>
          Livro não encontrado
        </Text>
      </View>
    );
  }

  return (

    <LinearGradient
      colors={[
        "#E8F5E9",
        "#F1F8E9",
        "#FFFFFF",
      ]}
      style={styles.container}
    >

      <ScrollView>

        <View style={styles.card}>

          <Text style={styles.title}>
            {book.title}
          </Text>

          <Text style={styles.label}>
            Autor
          </Text>

          <Text style={styles.text}>
            {book.author}
          </Text>

          <Text style={styles.label}>
            ISBN
          </Text>

          <Text style={styles.text}>
            {book.isbn}
          </Text>

          <Text style={styles.label}>
            Descrição
          </Text>

          <Text style={styles.text}>
            {book.description}
          </Text>

          <Text style={styles.label}>
            Disponível para
          </Text>

          <Text style={styles.text}>
            {
                book.status === "DOACAO"
                ? "Doação"
                : "Troca"
            }
          </Text>

          <Text style={styles.label}>
            Dono
          </Text>

          <Text style={styles.text}>
            {book.userName}
          </Text>

          <TouchableOpacity style={[styles.button,requestSent && styles.buttonDisabled]} disabled={requestSent}
            onPress={() => handleRequestBook(
                book.id!,
                book.userId!)}>

            <Text style={styles.buttonText}>

              {
                requestSent
                  ? "Solicitação enviada"
                  : "Solicitar Interesse"
              }

            </Text>

          </TouchableOpacity>
          {
            errorMessage
            ? (
                <Text style={styles.errorText}>
                  {errorMessage}
                </Text>
              )
            : null
          }

        </View>

      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#66BB6A",
    marginTop: 16,
    marginBottom: 4,
  },

  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#66BB6A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonDisabled: {
    backgroundColor: "#999",
  },

  errorText: {
    color: "#D32F2F",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});