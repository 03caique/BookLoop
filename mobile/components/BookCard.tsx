import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Book } from "../models/Book";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export function BookCard({
  book,
  onPress,
}: BookCardProps) {

  const imageUrl =
    book.photos?.length
      ? `${process.env.EXPO_PUBLIC_API_URL}${book.photos[0].imageUrl}`
      : null;

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >

      {
        imageUrl ? (

          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />

        ) : (

          <View style={styles.bookIcon}>

            <Feather
              name="book"
              size={30}
              color="#2E7D32"
            />

          </View>

        )
      }

      <View style={styles.info}>

        <Text style={styles.title}>
          {book.title}
        </Text>

        <Text style={styles.text}>
          Autor: {book.author}
        </Text>

        <Text style={styles.text}>
          Para: {book.status === "DOACAO"
            ? "Doação"
            : "Troca"}
        </Text>

        <Text style={styles.text}>
          Dono: {book.userName}
        </Text>

      </View>

    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },

  bookIcon: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },

  text: {
    color: "#555",
    marginBottom: 2,
  },

});