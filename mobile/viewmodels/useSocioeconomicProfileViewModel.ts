import { useState } from "react";

import { Alert }
from "react-native";

import {
  createSocioeconomicProfile
}
from "../services/socioeconomicProfileService";

export function useSocioeconomicProfileViewModel() {

  const [familyIncome, setFamilyIncome] =
    useState("");

  const [
    educationLevel,
    setEducationLevel
  ] = useState("");

  const [
    householdSize,
    setHouseholdSize
  ] = useState("");

  const [
    workSituation,
    setWorkSituation
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {

    if (
      !familyIncome ||
      !educationLevel ||
      !householdSize ||
      !workSituation
    ) {

      Alert.alert(
        "Erro",
        "Preencha todos os campos"
      );

      return;
    }

    try {

      setLoading(true);

      await createSocioeconomicProfile({

        familyIncome,

        educationLevel,

        householdSize,

        workSituation,

      });

      Alert.alert(
        "Sucesso",
        "Perfil socioeconômico cadastrado!"
      );

    } catch {

      Alert.alert(
        "Erro",
        "Não foi possível salvar os dados"
      );

    } finally {

      setLoading(false);

    }
  }

  return {

    familyIncome,
    setFamilyIncome,

    educationLevel,
    setEducationLevel,

    householdSize,
    setHouseholdSize,

    workSituation,
    setWorkSituation,

    loading,

    handleSubmit,
  };
}