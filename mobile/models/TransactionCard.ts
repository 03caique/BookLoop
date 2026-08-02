import { TransactionStatus } from "./Transaction";

export interface TransactionCard {
  id: number;

  type: "TROCA" | "DOACAO";

  otherUserId: number;
  otherUserName: string;

  myBookTitle: string;

  otherBookTitle?: string;

  transactionId: number;

  transactionStatus: TransactionStatus;

  isProponent: boolean;
}
