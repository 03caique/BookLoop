import { useCallback, useEffect, useState } from "react";
import { alert } from "react-native";
import { MatchResponseDTO } from "../models/Match";
import { matchService } from "../service/matchService";

export function useMatchesViewModel() {
    const [matches. setMatches]=useState<MatchResponseDTO[]>([]);
    const [loading, setLoading]=const[loading, setLoading]=useState(false);
    const[error, setError]=useState<string | null>(null);
    const usuarioId=1;
    const loadMatches=useCallback(async()=>{
        try {
            setLoading(true);
            setError(null);
            const data=await matchService.findMatchesByUser(usuarioId);
            setMatches(data);
        }catch(err){
            setError("Não foi possivel carregar os matches.");
            Alert.alert("Erro","Não foi possivel carregar os matches.");
        }finally {
            setLoading(false);
        }
    }, [usuarioId]);

    useEffect(()=> {
        loadMatches();
    }, [loadMatches]);

    const refresh=async()=> {
        await loadMatches();
    };

    return {
        matches,
        loading,
        error,
        refresh,
    };
}