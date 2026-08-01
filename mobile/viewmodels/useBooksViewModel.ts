import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Book } from "../models/Book";
import { getBooks } from "../services/bookService";

export function useBooksViewModel(initialSearch = "", size = 10) {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState(initialSearch);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadBooks() {
    try {
      setLoading(true);

      const response = await getBooks(search, size, 0);

      setBooks(response.content);
      setPage(0);
      setHasMore(!response.last);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os livros");
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreBooks() {
    if (loadingMore || loading || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;
      const response = await getBooks(search, size, nextPage);

      setBooks((prev) => [...prev, ...response.content]);
      setPage(nextPage);
      setHasMore(!response.last);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar mais livros");
    } finally {
      setLoadingMore(false);
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
    loadingMore,

    loadBooks,
    loadMoreBooks,
  };
}