import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Book } from "../models/Book";
import { getBooks } from "../services/bookService";

export function useBooksViewModel(initialSearch = "") {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(false);

  async function loadBooks() {
    try {
      setLoading(true);

      const response = await getBooks(search);

      const sortedBooks = [...response.content].sort(
        (a, b) => (b.id ?? 0) - (a.id ?? 0),
      );

      setBooks(sortedBooks);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os livros");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  return {
    books,

    search,
    setSearch,

    loading,

    loadBooks,
  };
}
