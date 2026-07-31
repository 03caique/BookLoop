import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavigation } from "../components/BottomNavigation";

import { useSocioeconomicProfileViewModel } from "../viewmodels/useSocioeconomicProfileViewModel";

import { Picker } from "@react-native-picker/picker";

import { router } from "expo-router";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function SocioeconomicProfile() {
  const vm = useSocioeconomicProfileViewModel();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    vm.loadProfile();
  }, []);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[Palette.primary, Palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color={Palette.white} />
          </TouchableOpacity>

          <Text style={styles.title}>Perfil Socioeconômico</Text>

          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Renda Familiar</Text>

          <View style={styles.inputContainer}>
            <Feather
              name="dollar-sign"
              size={20}
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="Ex: 2500"
              placeholderTextColor={Palette.placeholder}
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
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="Ex: 4"
              placeholderTextColor={Palette.placeholder}
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
            onPress={vm.editing ? vm.handleUpdate : vm.handleSubmit}
            disabled={vm.loading}
            style={styles.button}
          >
            <LinearGradient
              colors={[Palette.primary, Palette.secondary]}
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
                {vm.loading
                  ? vm.editing
                    ? "ATUALIZANDO..."
                    : "SALVANDO..."
                  : vm.editing
                    ? "ATUALIZAR"
                    : "SALVAR"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  appBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
  },

  container: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },

  formContainer: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Palette.primaryDark,
    marginBottom: 12,
    marginTop: 10,
  },

  optionsContainer: {
    gap: 10,
    marginBottom: Spacing.lg,
  },

  optionButton: {
    borderWidth: 2,
    borderColor: Palette.borderLight,
    borderRadius: Radius.md,
    padding: 12,
    backgroundColor: Palette.white,
  },

  activeOptionButton: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },

  optionText: {
    color: Palette.primaryDark,
    textAlign: "center",
    fontWeight: "600",
  },

  activeOptionText: {
    color: Palette.white,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Palette.borderLight,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 56,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Palette.primaryDark,
  },

  button: {
    borderRadius: Radius.md,
    overflow: "hidden",
    marginTop: 12,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: "700",
  },

  pickerContainer: {
    backgroundColor: Palette.white,

    borderWidth: 2,
    borderColor: Palette.borderLight,

    borderRadius: Radius.md,

    marginBottom: Spacing.lg,

    overflow: "hidden",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Palette.primaryDark,

    marginBottom: 8,
    marginTop: 4,
  },
});