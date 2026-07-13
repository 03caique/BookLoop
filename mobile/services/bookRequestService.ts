import api from "./api";

import {
  BookRequest,
  BookRequestResponseDTO,
  BookRequestUpdateDTO,
  PageResponse,
} from "../models/BookRequest";

class BookRequestService {

  async createBookRequest(data: BookRequest) {

    const response = await api.post(
      "/api/book-requests",
      data
    );

    return response.data;
  }

  async findByProponent(
    proponentId: number
  ): Promise<PageResponse<BookRequestResponseDTO>> {

    const response =
      await api.get<PageResponse<BookRequestResponseDTO>>(
        "/api/book-requests",
        {
          params: {
            proponentId,
          },
        }
      );

    return response.data;
  }

  async updateStatus(
    id: number,
    status: "ACEITA" | "RECUSADA"
  ): Promise<BookRequestResponseDTO> {

    const dto: BookRequestUpdateDTO = {
      status,
    };

    const response =
      await api.put<BookRequestResponseDTO>(
        `/api/book-requests/${id}`,
        dto
      );

    return response.data;
  }
}

export default new BookRequestService();