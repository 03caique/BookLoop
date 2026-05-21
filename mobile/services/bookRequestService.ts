import api from "./api";

import { BookRequest }
from "../models/BookRequest";

export async function createBookRequest(
  data: BookRequest
) {

  const response = await api.post(
    "/api/book-requests",
    data
  );

  return response.data;
}