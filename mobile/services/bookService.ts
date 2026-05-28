import api from "./api";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import { Book } from "../models/Book";

export async function registerBook(
  book: Book
) {

  const userId =
    await AsyncStorage.getItem(
      "userId"
    );

  const response = await api.post(
    "/api/books",
    {

      ...book,

      userId: Number(userId),
    }
  );

  return response.data;
}

export async function getBooks(
  search = ""
) {

  const response = await api.get(
    "/api/books",
    {
      params: {
        search,
      },
    }
  );

  return response.data;
}

export async function getBookById(
  id: number
) {

  const response = await api.get(
    `/api/books/${id}`
  );

  return response.data;
}

export async function getBooksByUser(
  userId: number
) {

  const response = await api.get(
    `/api/users/${userId}/books`
  );

  return response.data;
}