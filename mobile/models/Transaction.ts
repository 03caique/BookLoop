export type TransactionStatus= 
| "PENDENTE"
| "EM_ANDAMENTO"
| "CONCLUIDA"
| "CANCELADA";

export interface Transaction{
    id: number;
    status: TransactionStatus;
    matchId: number;
    bookId: number;
    bookTitle: string;
    proponentId: number;
    proponentName: string;
    createAt: string;
}