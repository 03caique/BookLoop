export type TransactionStatus= 
| "PENDENTE"
| "FINALIZADA"
| "CANCELADA";

export interface Transaction{
    id: number;
    status: TransactionStatus;
    matchId: number;
    bookId: number;
    bookTitle: string;
    proponentId: number;
    proponentName: string;
    requesterId: number;
    requesterName: string;
    createdAt: string | null;
}