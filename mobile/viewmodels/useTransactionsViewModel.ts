import { matchService } from "../services/matchService";
import { transactionService } from "../services/transactionService";
export function useTransactionsViewModel() {
  const [transactions, setTransactions] = useState<TransactionCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmingTransactionId, setConfirmingTransactionId] = useState<
    number | null
  >(null);
