export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: "DOACAO" | "TROCA";
  photos: string[];
}