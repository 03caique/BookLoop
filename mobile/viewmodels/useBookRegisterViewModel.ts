import { useState } from "react";

import { Alert } from "react-native";

import { registerBook } from "../services/bookService";

export function useBookRegisterViewModel() {

  const [title, setTitle] =
    useState("");

  const [author, setAuthor] =
    useState("");

  const [isbn, setIsbn] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState<"DOACAO" | "TROCA">(
        "DOACAO"
    );

  async function handleRegisterBook() {

    if (
      !title.trim() ||
      !author.trim() ||
      !isbn.trim() ||
      !description.trim()
    ) {

      Alert.alert(
        "Erro",
        "Preencha todos os campos"
      );

      return;
    }

    try {

      setLoading(true);

      await registerBook({
        title,
        author,
        isbn,
        description,
        status,
      });

      Alert.alert(
        "Sucesso",
        "Livro cadastrado com sucesso!"
      );

      setTitle("");
      setAuthor("");
      setIsbn("");
      setDescription("");

    } catch (error: any) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o livro"
      );

    } finally {

      setLoading(false);

    }
  }

  return {

    title,
    setTitle,

    author,
    setAuthor,

    isbn,
    setIsbn,

    description,
    setDescription,

    loading,

    status,
    setStatus,

    handleRegisterBook,
  };
}