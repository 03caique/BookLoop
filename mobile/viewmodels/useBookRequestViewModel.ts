import { Alert }
from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import { createBookRequest }
from "../services/bookRequestService";

import { useState }
from "react";

export function useBookRequestViewModel() {

  const [requestSent, setRequestSent] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleRequestBook( bookId: number, ownerId: number) {
    try {
        setErrorMessage("");

        const requesterId =
        await AsyncStorage.getItem(
            "userId"
        );

        if (!requesterId) {

        setErrorMessage(
            "Usuário não autenticado"
        );

        return;
        }

        if (
        Number(requesterId) === ownerId
        ) {

        setErrorMessage(
            "Você não pode solicitar seu próprio livro"
        );

        return;
        }

        await createBookRequest({

        bookId,

        requesterId:
            Number(requesterId),
        });

        setRequestSent(true);

    } catch (error: any) {
        console.log(error);

        if (error.response?.status === 409) {

            setRequestSent(true);

            setErrorMessage(
            "Você já enviou uma solicitação para este livro"
            );

            return;
        }

        setErrorMessage(
            "Não foi possível enviar a solicitação"
        );
    }
  }

  return {

    requestSent,

    errorMessage,

    handleRequestBook,
  };
}