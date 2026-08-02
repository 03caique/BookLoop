import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Book } from "../models/Book";
import { deleteBook, getBooksByUser } from "../services/bookService";
import { getUser, updateUser } from "../services/userService";

export function useProfileViewModel() {
  const { userId } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [originalEmail, setOriginalEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(false);

  const [books, setBooks] = useState<Book[]>([]);

  async function loadUser() {
    if (!userId) {
      return;
    }

    try {
      setLoading(true);

      const response = await getUser(userId);

      setName(response.name);
      setEmail(response.email);
      setOriginalEmail(response.email);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o perfil");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!userId) {
      return false;
    }

    try {
      setLoading(true);

      await updateUser(userId, {
        name,
        email,
      });

      Alert.alert("Sucesso", "Perfil atualizado");

      return email !== originalEmail;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar");

      return false;
    } finally {
      setLoading(false);
    }
  }

  async function loadUserBooks() {
    if (!userId) {
      return;
    }

    try {
      const response = await getBooksByUser(userId);

      setBooks(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteBook(bookId: number) {
    Alert.alert("Remover livro", "Tem certeza que deseja remover este livro?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            await deleteBook(bookId);

            setBooks((currentBooks) =>
              currentBooks.filter((book) => book.id !== bookId),
            );

            Alert.alert("Livro removido", "O livro foi removido com sucesso.");
          } catch (error) {
            console.error(error);

            Alert.alert("Erro", "Não foi possível remover o livro.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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

    handleDeleteBook,

    editing,
    setEditing,

    books,
  };
}
