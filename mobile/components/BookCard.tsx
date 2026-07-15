import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Book } from "../models/Book";

interface BookCardProps {
  book: Book;
  onPress: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function BookCard({
  book,
  onPress,
  showEditButton = false,
  onEdit,
}: BookCardProps) {
  const imageUrl = book.photos?.length
    ? `${process.env.EXPO_PUBLIC_API_URL}${book.photos[0].imageUrl}`
    : null;

  return (
    <View style={styles.card}>
      {showEditButton && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Feather name="edit-2" size={18} color="#2E7D32" />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.bookIcon}>
            <Feather name="book" size={30} color="#2E7D32" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{book.title}</Text>

          <Text style={styles.text}>Autor: {book.author}</Text>

          <Text style={styles.text}>
            Para: {book.status === "DOACAO" ? "Doação" : "Troca"}
          </Text>

          <Text style={styles.text}>Dono: {book.userName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  backgroundColor: "#FFF",
  borderRadius: 20,
  padding: 16,
  marginBottom: 16,
  elevation: 3,
  position: "relative",
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

  editButton: {
  position: "absolute",
  top: 12,
  right: 12,
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: "#FFF",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
  zIndex: 10,
},

cardContent: {
  flexDirection: "row",
  flex: 1,
  alignItems: "center",
},
});
