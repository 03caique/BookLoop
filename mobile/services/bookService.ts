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