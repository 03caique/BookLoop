import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createSocioeconomicProfile,
  getSocioeconomicProfile,
  updateSocioeconomicProfile,
} from "../services/socioeconomicProfileService";

export function useSocioeconomicProfileViewModel() {
  const [familyIncome, setFamilyIncome] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [workSituation, setWorkSituation] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const profile = await getSocioeconomicProfile(Number(userId));

      setFamilyIncome(profile.familyIncome.toString());
      setEducationLevel(profile.educationLevel);
      setHouseholdSize(profile.householdSize.toString());
      setWorkSituation(profile.workSituation);
      setEditing(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setFamilyIncome("");
        setEducationLevel("");
        setHouseholdSize("");
        setWorkSituation("");
        setEditing(false);
        return;
      }

      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o perfil socioeconômico.");
    } finally {
      setLoading(false); // 👈 faltava isso
    }
  }

  async function handleSubmit() {
    if (!familyIncome || !educationLevel || !householdSize || !workSituation) {
      Alert.alert("Erro", "Preencha todos os campos");

      return;
    }

    try {
      setLoading(true);

      await createSocioeconomicProfile({
        id: 0,
        familyIncome: Number(familyIncome),
        educationLevel,
        householdSize: Number(householdSize),
        workSituation,
      });

      Alert.alert("Sucesso", "Perfil socioeconômico cadastrado!");
    } catch (error) {
      console.error(error);

      Alert.alert("Erro", "Não foi possível salvar os dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!familyIncome || !educationLevel || !householdSize || !workSituation) {
      Alert.alert("Erro", "Preencha todos os campos");

      return;
    }

    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      await updateSocioeconomicProfile(Number(userId), {
        familyIncome: Number(familyIncome),
        educationLevel,
        householdSize: Number(householdSize),
        workSituation,
      });

      Alert.alert("Sucesso", "Perfil socioeconômico atualizado!");
    } catch (error) {
      console.error(error);

      Alert.alert("Erro", "Não foi possível atualizar os dados.");
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

    editing,

    loadProfile,
    handleSubmit,
    handleUpdate,
  };
}
