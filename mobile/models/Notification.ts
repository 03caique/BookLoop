export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "SOLICITACAO_RECEBIDA" | "MATCH_CRIADO";
  read: boolean;
  createdAt: string;
}