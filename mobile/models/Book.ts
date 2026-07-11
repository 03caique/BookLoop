export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: "DOACAO" | "TROCA";
  photos: string[];
  userName?: string;
}
