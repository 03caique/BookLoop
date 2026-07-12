import api from "./api";
import{
  BookRequestResponseDTO,
  BookRequestUpdateDTO,
  PageResponse,
} from "../models/BookRequest";

class  bookRequestService {
  async findByProponent(
    proponentId: number
  ):
Promise<PageResponse<BookRequestResponseDTO>> {
  const response=await
api.get<PageResponse<BookRequestResponseDTO>>(
  "/api/bok-requests",
    params: {
      proponentId,
    },
  }
 );
}
return response.data;  
}

async updateStatus(
  id: number,
  status: "ACEITA" | "RECUSADA"
): Promise<BookRequestResponseDTO> {
  const dto: BookRequestUpdateDTO={
    status,
  }:

  const response=awaitapi.put<BookRequestResponseDTO>(
    `/api/book-requests/${id}`,
    dto
  );

  return response.data;
 }
}

export default new bookRequestService