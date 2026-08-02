import{ useEffect, useState }from "react";
import{ Alert }from "react-native";
import{ useAuth }from "../contexts/AuthContext";
import{ Transaction }from "../models/Transaction";
import { transactionService } from "../services/transactionService";

export function useTransactionHistoryViewModel(){
    const{
        userId,
    }=useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading]=useState(false);

    async function loadTransactions() {
        if(!userId){
            return;
        }
        try{
            setLoading(true);
            const response = await transactionService.getMyTransactions();
            setTransactions(response);
        } catch (error){
            Alert.alert(
                "Erro",
                "Não foi possivel carregar o histórico de transações."
            );
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
      loadTransactions();
    }, [userId]);
    return{
        transactions,
        loading,
        loadTransactions,
    };
}