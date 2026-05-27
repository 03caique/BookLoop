import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLoginViewModel() {

  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {

    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert(
        "Erro",
        "E-mail inválido"
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Erro",
        "A senha deve ter no mínimo 8 caracteres"
      );
      return;
    }

    try {

      setLoading(true);

      const response = await login({
        email,
        password,
      });

      await signIn(response.token);

      await AsyncStorage.setItem(
        "userId",
        String(response.userId)
      );

      Alert.alert(
        "Sucesso",
        "Login realizado!"
      );

      setEmail("");
      setPassword("");

      router.replace("/home");

    } catch (error: any) {

      let errorMessage =
        "Erro ao tentar fazer login";

      if (error.response?.status === 401) {
        errorMessage =
          "E-mail ou senha inválidos";
      }

      if (error.response?.status === 500) {
        errorMessage =
          "Erro interno do servidor";
      }

      Alert.alert(
        "Erro",
        errorMessage
      );

    } finally {

      setLoading(false);

    }
  }

  return {

    email,
    setEmail,

    password,
    setPassword,

    loading,

    showPassword,
    setShowPassword,

    handleLogin,
  };
}