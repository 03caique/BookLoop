import { BookPhoto } from "./BookPhoto";

export interface Book {
  id?: number;

  title: string;
  author: string;
  isbn?: string;
  description: string;

  status: "DOACAO" | "TROCA" | "INATIVO";

  condition: "NOVO" | "SEMINOVO" | "BOM" | "REGULAR" | "RUIM";

  userId?: number;
  userName?: string;

  photos: BookPhoto[];
}