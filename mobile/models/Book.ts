export interface Book {

  title: string;

  author: string;

  isbn: string;

  description: string;

  status: "DOACAO" | "TROCA";
}