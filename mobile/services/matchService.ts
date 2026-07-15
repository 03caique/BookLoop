import api from "./api";
import{ MatchResponseDTO } from "../models/Match";

const findMatchesByUser = async(
    usuarioId: number
): Promise<MatchResponseDTO[]> =>{
    const response=await
api.get<MatchResponseDTO[]>("/api/matches", {
    params: {
        usuarioId,
    },
});

return response.data;
};

export const matchService={
    findMatchesByUser,
};