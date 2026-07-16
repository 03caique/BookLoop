export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "SOLICITACAO_RECEBIDA";
  read: boolean;
  createdAt: string;
}