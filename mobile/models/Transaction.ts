export type TransactionStatus= 
| "PENDENTE"
| "FINALIZADA"
| "CANCELADA";

export type TransactionType=
| "TROCA"
| "DOACAO"

export interface Transaction{
    id: number;
    status: TransactionStatus;
    matchId: number | null;
    bookId: number;
    bookTitle: string;
    proponentId: number;
    proponentName: string;
    requesterId: number;
    requesterName: string;
    createdAt: string | null;
    type: TransactionType;
    otherUserId: number;
    otherUserName: string;
}