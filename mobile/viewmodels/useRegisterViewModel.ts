import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { register } from "../services/authService";

export function useRegisterViewModel() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Erro", "Preencha todos os campos");

      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "E-mail inválido");

      return;
    }

    if (password.length < 8) {
      Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres");

      return;
    }

    try {
      setLoading(true);

      await register({
        name,
        email,
        password,
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.push("/login");
    } catch (error: any) {
      
      console.log("Erro completo:", error);
      console.log("Response:", error.response);
      console.log("Request:", error.request);
      console.log("Message:", error.message);

      let errorMessage = "Erro ao cadastrar usuário";

      if (error.response?.status === 409) {
        errorMessage = "Este e-mail já está cadastrado";
      }

      if (error.response?.status === 400) {
        errorMessage = "Dados inválidos";
      }

      if (error.response?.status === 500) {
        errorMessage = "Erro interno do servidor";
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    setName,

    email,
    setEmail,

    password,
    setPassword,

    confirmPassword,
    setConfirmPassword,

    loading,

    showPassword,
    setShowPassword,

    handleRegister,
  };
}
