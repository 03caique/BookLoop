import{ useEffect, useState }from "react";
import{ Alert }from "react-native";
import{ useAuth }from "../contexts/AuthContext";
import{ Transaction }from "../models/Transaction";
import{ getTransactionByUser }from "../services/transactionService";

export function useTransactionHistoryViewModel(){
    const{
        userId,
    }=useAuth();
    const [Transactions, setTransactions]=useState<Transaction[]>([]);
    const [loading, setLoading]=useState(false);

    async function loadingTransactions() {
        if(!userId){
            return;
        }
        try{
            setLoading(true);
            const response=await getTransactionByUser(userId);
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
    useEffect(()=>{
        loadingTransactions();
    }, []);
    return{
        Transactions,
        loading,
        loadingTransactions,
    };
}