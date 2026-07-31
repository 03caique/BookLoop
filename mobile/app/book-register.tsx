import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { BottomNavigation } from "../components/BottomNavigation";

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBookRegisterViewModel } from "../viewmodels/useBookRegisterViewModel";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function BookRegister() {
  const vm = useBookRegisterViewModel();
  const insets = useSafeAreaInsets();

  const conditionDescriptions = {
    NOVO: "Nunca usado ou em estado equivalente a novo, sem sinais relevantes de uso.",
    SEMINOVO: "Pouco usado, bem conservado, com mínimos sinais de manuseio.",
    BOM: "Usado, mas bem conservado, podendo apresentar pequenos sinais de uso.",
    REGULAR:
      "Apresenta sinais visíveis de uso, mas continua em condições adequadas para leitura.",
    RUIM: "Apresenta desgaste significativo, como marcas, rasgos ou outros danos, mas ainda pode ser lido.",
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Palette.primary, Palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.header}>
          {vm.isEditing ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={26} color={Palette.white} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 26 }} />
          )}

          <Text style={styles.title}>
            {vm.isEditing ? "Editar Livro" : "Cadastrar Livro"}
          </Text>

          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}>
        <View style={styles.formContainer}>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,

                vm.status === "DOACAO" && styles.activeTypeButton,
              ]}
              onPress={() => vm.setStatus("DOACAO")}
            >
              <Text
                style={[
                  styles.typeButtonText,

                  vm.status === "DOACAO" && styles.activeTypeButtonText,
                ]}
              >
                Doação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,

                vm.status === "TROCA" && styles.activeTypeButton,
              ]}
              onPress={() => vm.setStatus("TROCA")}
            >
              <Text
                style={[
                  styles.typeButtonText,

                  vm.status === "TROCA" && styles.activeTypeButtonText,
                ]}
              >
                Troca
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="book"
              size={20}
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="Titulo"
              placeholderTextColor={Palette.placeholder}
              value={vm.title}
              onChangeText={vm.setTitle}
              style={styles.input}
              editable={!vm.loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="edit"
              size={20}
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="Autor"
              placeholderTextColor={Palette.placeholder}
              value={vm.author}
              onChangeText={vm.setAuthor}
              style={styles.input}
              editable={!vm.loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="hash"
              size={20}
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="ISBN (opcional)"
              placeholderTextColor={Palette.placeholder}
              value={vm.isbn}
              onChangeText={vm.setIsbn}
              onBlur={vm.handleIsbnSearch}
              style={styles.input}
              editable={!vm.loading}
            />
          </View>

          <Text style={styles.conditionTitle}>Estado de conservação</Text>

          <View style={styles.conditionContainer}>
            {[
              { value: "NOVO", label: "Novo" },
              { value: "SEMINOVO", label: "Seminovo" },
              { value: "BOM", label: "Bom" },
              { value: "REGULAR", label: "Regular" },
              { value: "RUIM", label: "Ruim" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.conditionButton,
                  vm.condition === item.value && styles.activeConditionButton,
                ]}
                onPress={() =>
                  vm.setCondition(item.value as typeof vm.condition)
                }
                disabled={vm.loading}
              >
                <Text
                  style={[
                    styles.conditionButtonText,
                    vm.condition === item.value &&
                      styles.activeConditionButtonText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.conditionDescription}>
            <Feather name="info" size={16} color={Palette.primary} />

            <Text style={styles.conditionDescriptionText}>
              {conditionDescriptions[vm.condition]}
            </Text>
          </View>

          <View style={[styles.inputContainer, styles.descriptionContainer]}>
            <TextInput
              placeholder="Descrição"
              placeholderTextColor={Palette.placeholder}
              value={vm.description}
              onChangeText={vm.setDescription}
              multiline
              style={styles.descriptionInput}
              editable={!vm.loading}
            />
          </View>

          <Text style={styles.photosTitle}>Adicionar fotos do livro</Text>

          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity style={styles.photoButton} onPress={vm.takePhoto}>
              <Feather name="camera" size={22} color={Palette.primaryDark} />

              <Text style={styles.photoButtonText}>Câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoButton}
              onPress={vm.pickImages}
            >
              <Feather name="image" size={22} color={Palette.primaryDark} />

              <Text style={styles.photoButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photosContainer}>
            {vm.photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.photoPreview}
                />

                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => vm.removePhoto(index)}
                >
                  <Feather name="x" size={16} color={Palette.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={vm.isEditing ? vm.handleUpdateBook : vm.handleRegisterBook}
            disabled={vm.loading}
            style={[styles.button, vm.loading && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={
                vm.loading
                  ? [Palette.disabled, Palette.disabled]
                  : [Palette.primary, Palette.secondary]
              }
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
                  ? vm.isEditing
                    ? "SALVANDO..."
                    : "CADASTRANDO..."
                  : vm.isEditing
                    ? "SALVAR ALTERAÇÕES"
                    : "CADASTRAR"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!vm.isEditing && <BottomNavigation />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
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

  formContainer: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    zIndex: 10,
    elevation: 5,
  },

  typeContainer: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
    gap: 12,
  },

  typeButton: {
    flex: 1,

    borderWidth: 2,
    borderColor: Palette.borderLight,

    borderRadius: Radius.md,

    paddingVertical: 14,

    alignItems: "center",

    backgroundColor: Palette.white,
  },

  activeTypeButton: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },

  typeButtonText: {
    color: Palette.primary,
    fontWeight: "600",
  },

  activeTypeButtonText: {
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

  descriptionContainer: {
    height: 120,
    alignItems: "flex-start",
    paddingTop: Spacing.md,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Palette.primaryDark,
  },

  descriptionInput: {
    flex: 1,
    width: "100%",
    fontSize: 16,
    color: Palette.primaryDark,
    textAlignVertical: "top",
  },

  button: {
    borderRadius: Radius.md,
    overflow: "hidden",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },

  photosTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.primaryDark,
    marginBottom: 10,
  },

  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: Palette.borderLight,

    borderRadius: Radius.md,

    paddingVertical: 14,

    marginBottom: Spacing.md,

    flex: 1,
  },

  photoButtonText: {
    marginLeft: 8,
    color: Palette.primaryDark,
    fontWeight: "600",
  },

  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: Spacing.lg,
  },

  photoPreview: {
    width: 90,
    height: 90,
    borderRadius: Radius.sm,
  },

  photoWrapper: {
    position: "relative",
  },

  removePhotoButton: {
    position: "absolute",
    top: 4,
    right: 4,

    width: 24,
    height: 24,

    borderRadius: 12,

    backgroundColor: Palette.overlayDark,

    justifyContent: "center",
    alignItems: "center",
  },

  photoButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: Spacing.md,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  conditionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.primaryDark,
    marginBottom: 10,
  },

  conditionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: Spacing.lg,
  },

  conditionButton: {
    borderWidth: 2,
    borderColor: Palette.borderLight,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    backgroundColor: Palette.white,
  },

  activeConditionButton: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },

  conditionButtonText: {
    color: Palette.primary,
    fontWeight: "600",
  },

  activeConditionButtonText: {
    color: Palette.white,
  },

  conditionDescription: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Palette.tint,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  conditionDescriptionText: {
    flex: 1,
    marginLeft: 8,
    color: Palette.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});