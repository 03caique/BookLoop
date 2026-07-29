export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  description: string;
  status: "DOACAO" | "TROCA";
  condition: "NOVO" | "SEMINOVO" | "BOM" | "REGULAR" | "RUIM";
  photos: string[];
}