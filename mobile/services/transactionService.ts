import api from "./api";
import { Transaction } from "../models/Transaction";

async function getMyTransactions(): Promise<Transaction[]> {
  const response = await api.get("/api/transactions/my");

  return response.data.content;
}

async function confirmDelivery(
  transactionId: number
): Promise<void> {
  await api.put(`/api/transactions/${transactionId}/confirmar`);
}

export const transactionService = {
  getMyTransactions,
  confirmDelivery,
};