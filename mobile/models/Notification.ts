export interface Notification {
  id: number;
  title: string;
  message: string;
  type:
    | "SOLICITACAO_RECEBIDA"
    | "SOLICITACAO_ACEITA"
    | "MATCH_CRIADO"
    | "TRANSACAO_FINALIZADA";
  read: boolean;
  createdAt: string;
}