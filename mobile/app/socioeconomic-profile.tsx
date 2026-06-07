import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomNavigation } from "../components/BottomNavigation";

import { useSocioeconomicProfileViewModel } from "../viewmodels/useSocioeconomicProfileViewModel";

import { Picker } from "@react-native-picker/picker";

import { router } from "expo-router";

export default function SocioeconomicProfile() {
  const vm = useSocioeconomicProfileViewModel();

  const educationOptions = [
    "ENSINO_FUNDAMENTAL_INCOMPLETO",
    "ENSINO_FUNDAMENTAL_COMPLETO",
    "ENSINO_MEDIO_INCOMPLETO",
    "ENSINO_MEDIO_COMPLETO",
    "ENSINO_SUPERIOR_INCOMPLETO",
    "ENSINO_SUPERIOR_COMPLETO",
    "POS_GRADUACAO_INCOMPLETO",
    "POS_GRADUACAO_COMPLETO",
  ];

  const workOptions = [
    "EMPREGADO",
    "DESEMPREGADO",
    "AUTONOMO",
    "ESTAGIARIO",
    "ESTUDANTE",
  ];

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#2E7D32" />
          </TouchableOpacity>

          <Text style={styles.title}>Perfil Socioeconômico</Text>

          <View style={{ width: 28 }} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Renda Familiar</Text>

          <View style={styles.inputContainer}>
            <Feather
              name="dollar-sign"
              size={20}
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Ex: 2500"
              placeholderTextColor="#A5D6A7"
              value={vm.familyIncome}
              onChangeText={vm.setFamilyIncome}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Quantidade de Pessoas na Residência</Text>

          <View style={styles.inputContainer}>
            <Feather
              name="users"
              size={20}
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Ex: 4"
              placeholderTextColor="#A5D6A7"
              value={vm.householdSize}
              onChangeText={vm.setHouseholdSize}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Escolaridade</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vm.educationLevel}
              onValueChange={vm.setEducationLevel}
            >
              <Picker.Item label="Selecione" value="" />

              <Picker.Item
                label="Ensino Fundamental Incompleto"
                value="ENSINO_FUNDAMENTAL_INCOMPLETO"
              />

              <Picker.Item
                label="Ensino Fundamental Completo"
                value="ENSINO_FUNDAMENTAL_COMPLETO"
              />

              <Picker.Item
                label="Ensino Médio Incompleto"
                value="ENSINO_MEDIO_INCOMPLETO"
              />

              <Picker.Item
                label="Ensino Médio Completo"
                value="ENSINO_MEDIO_COMPLETO"
              />

              <Picker.Item
                label="Ensino Superior Incompleto"
                value="ENSINO_SUPERIOR_INCOMPLETO"
              />

              <Picker.Item
                label="Ensino Superior Completo"
                value="ENSINO_SUPERIOR_COMPLETO"
              />

              <Picker.Item
                label="Pós-Graduação Incompleta"
                value="POS_GRADUACAO_INCOMPLETO"
              />

              <Picker.Item
                label="Pós-Graduação Completa"
                value="POS_GRADUACAO_COMPLETO"
              />
            </Picker>
          </View>

          <Text style={styles.label}>Situação de Trabalho</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vm.workSituation}
              onValueChange={vm.setWorkSituation}
            >
              <Picker.Item label="Selecione" value="" />

              <Picker.Item label="Empregado" value="EMPREGADO" />

              <Picker.Item label="Desempregado" value="DESEMPREGADO" />

              <Picker.Item label="Autônomo" value="AUTONOMO" />

              <Picker.Item label="Estagiário" value="ESTAGIARIO" />

              <Picker.Item label="Estudante" value="ESTUDANTE" />
            </Picker>
          </View>

          <TouchableOpacity
            onPress={vm.handleSubmit}
            disabled={vm.loading}
            style={styles.button}
          >
            <LinearGradient
              colors={["#66BB6A", "#26A69A"]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 0,
              }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {vm.loading ? "SALVANDO..." : "SALVAR"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    padding: 24,
    paddingVertical: 40,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  formContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 24,
    elevation: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 12,
    marginTop: 10,
  },

  optionsContainer: {
    gap: 10,
    marginBottom: 20,
  },

  optionButton: {
    borderWidth: 2,
    borderColor: "#C8E6C9",
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#FFF",
  },

  activeOptionButton: {
    backgroundColor: "#66BB6A",
    borderColor: "#66BB6A",
  },

  optionText: {
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "600",
  },

  activeOptionText: {
    color: "#FFF",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#C8E6C9",
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#2E7D32",
  },

  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  pickerContainer: {
    backgroundColor: "#FFF",

    borderWidth: 2,
    borderColor: "#C8E6C9",

    borderRadius: 16,

    marginBottom: 20,

    overflow: "hidden",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32",

    marginBottom: 8,
    marginTop: 4,
  },

});
