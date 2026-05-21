import { useEffect, useState }
from "react";

import { Alert }
from "react-native";

import { Book }
from "../models/Book";

import { getBookById }
from "../services/bookService";

export function useBookDetailsViewModel(
  id: number
) {

  const [book, setBook] =
    useState<Book | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadBook() {

    try {

      setLoading(true);

      const response =
        await getBookById(id);

      setBook(response);

    } catch (error: any) {

      if (
        error.response?.status === 404
      ) {

        Alert.alert(
          "Erro",
          "Livro não encontrado"
        );

      } else {

        Alert.alert(
          "Erro",
          "Não foi possível carregar o livro"
        );
      }

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    loadBook();

  }, []);

  return {

    book,

    loading,
  };
}