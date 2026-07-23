export interface BookRequest {
  bookId: number;
  requesterId: number;
}

export type BookRequestStatus =
  | "PENDENTE"
  | "ACEITA"
  | "RECUSADA"
  | "CANCELADA";

export interface BookRequestResponseDTO {
  id: number;
  status: BookRequestStatus;

  bookTitle: string;
  requesterName: string;

  priorityLevel: PriorityLevel | null;
  hasSocioeconomicProfile: boolean;
}

export type PriorityLevel = "ALTA" | "MEDIA" | "BAIXA";

export interface BookRequestUpdateDTO {
  status: Exclude<BookRequestStatus, "PENDENTE">;
}

export interface PageResponse<T> {
  content: T[];

  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}