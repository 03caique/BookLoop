import api from "./api";
import { ImagePickerAsset } from "expo-image-picker";
import { Book } from "../models/Book";
import { CreateBookRequest } from "../models/CreateBookRequest";

export async function registerBook(
  book: CreateBookRequest
) {
  const response = await api.post(
    "/api/books",
    book
  );

  return response.data;
}

export async function uploadBookPhoto(
  photo: ImagePickerAsset
): Promise<string> {

  const formData = new FormData();

  formData.append("file", {
    uri: photo.uri,
    name: photo.fileName ?? "photo.jpg",
    type: photo.mimeType ?? "image/jpeg",
  } as any);

  const response = await api.post(
    "/api/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

export async function updateBook(
  id: number,
  book: CreateBookRequest
) {
  const response = await api.put(
    `/api/books/${id}`,
    book
  );

  return response.data;
}

export async function findBookByIsbn(
  isbn: string
) {
  const response = await api.get(
    `/api/isbn/${isbn}`
  );

  return response.data;
}