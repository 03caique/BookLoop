import api from "./api";

export const transactionService = {
  async confirmDelivery(transactionId: number): Promise<void> {
    await api.put(`/api/transactions/${transactionId}/confirmar`);
  },
};