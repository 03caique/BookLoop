import { useEffect, useState } from "react";

import { Alert } from "react-native";

import { useAuth } from "../contexts/AuthContext";

import {
  getUser,
  updateUser,
} from "../services/userService";

import { Book } from "../models/Book";

import {
  getBooksByUser
} from "../services/bookService";

export function useProfileViewModel() {

  const {
    userId,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [books, setBooks] =
    useState<Book[]>([]);

  async function loadUser() {

    if (!userId) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await getUser(userId);

      setName(response.name);
      setEmail(response.email);

    } catch (error) {

      Alert.alert(
        "Erro",
        "Não foi possível carregar o perfil"
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleUpdate() {

    if (!userId) {
      return;
    }

    try {

      setLoading(true);

      await updateUser(userId, {
        name,
        email,
      });

      Alert.alert(
        "Sucesso",
        "Perfil atualizado"
      );

    } catch (error) {

      Alert.alert(
        "Erro",
        "Não foi possível atualizar"
      );

    } finally {

      setLoading(false);

    }
  }

  async function loadUserBooks() {

    if (!userId) {
      return;
    }

    try {

      const response =
        await getBooksByUser(userId);

      setBooks(response);

    } catch (error) {

      console.log(error);

    }
  }

  useEffect(() => {

    loadUser();
    loadUserBooks();

  }, []);

  return {

    name,
    setName,

    email,
    setEmail,

    loading,

    handleUpdate,

    editing,
    setEditing,

    books,
  };
}