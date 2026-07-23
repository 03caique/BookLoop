import api from "./api";
import{ Transaction }from "../models/Transaction";

export async function getTransactionByUser(
    userId: number
): Promise<Transaction[]>{

    const response=await api.get(
        "/api/transactions",
        {
            params: {
                usuarioId: userId
            },
        }
    );
    return response.data.content;
}

export const transactionService = {
  async confirmDelivery(transactionId: number): Promise<void> {
    await api.put(`/api/transactions/${transactionId}/confirmar`);
  },
};