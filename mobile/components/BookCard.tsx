import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Book } from "../models/Book";

interface BookCardProps {
  book: Book;
  onPress: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

export function BookCard({
  book,
  onPress,
  showEditButton = false,
  onEdit,
  showDeleteButton = false,
  onDelete,
}: BookCardProps) {
  const imageUrl = book.photos?.length
    ? `${process.env.EXPO_PUBLIC_API_URL}${book.photos[0].imageUrl}`
    : null;

  const hasActionButtons = showEditButton || showDeleteButton;

  return (
    <View style={styles.card}>
      {hasActionButtons && (
        <View style={styles.actionButtons}>
          {showEditButton && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Feather name="edit-2" size={18} color="#2E7D32" />
            </TouchableOpacity>
          )}

          {showDeleteButton && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Feather name="trash-2" size={18} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>
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
          <Text
            style={[styles.title, hasActionButtons && styles.titleWithActions]}
            numberOfLines={1}
          >
            {book.title}
          </Text>

          <View style={styles.infoRow}>
            <Feather name="edit-3" size={12} color="#81C784" />
            <Text style={styles.text} numberOfLines={1}>
              {book.author}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="tag" size={12} color="#81C784" />
            <Text style={styles.text}>
              {book.status === "DOACAO" ? "Doação" : "Troca"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="star" size={12} color="#81C784" />
            <Text style={styles.text}>
              Estado:{" "}
              {book.condition === "NOVO"
                ? "Novo"
                : book.condition === "SEMINOVO"
                  ? "Seminovo"
                  : book.condition === "BOM"
                    ? "Bom"
                    : book.condition === "REGULAR"
                      ? "Regular"
                      : "Ruim"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="user" size={12} color="#81C784" />
            <Text style={styles.text} numberOfLines={1}>
              {book.userName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#C8E6C9",
    padding: 16,
    marginBottom: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    minWidth: 0,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },

  titleWithActions: {
    paddingRight: 76,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  text: {
    color: "#555",
    marginLeft: 6,
    fontSize: 13,
    flexShrink: 1,
  },

  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  actionButtons: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
