import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { useBookRegisterViewModel } from "../viewmodels/useBookRegisterViewModel";

export default function BookRegister() {
  const vm = useBookRegisterViewModel();

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Cadastrar Livro</Text>
        </View>

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
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Titulo"
              placeholderTextColor="#A5D6A7"
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
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Autor"
              placeholderTextColor="#A5D6A7"
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
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="ISBN"
              placeholderTextColor="#A5D6A7"
              value={vm.isbn}
              onChangeText={vm.setIsbn}
              style={styles.input}
              editable={!vm.loading}
            />
          </View>

          <View style={[styles.inputContainer, styles.descriptionContainer]}>
            <TextInput
              placeholder="Descrição"
              placeholderTextColor="#A5D6A7"
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
              <Feather name="camera" size={22} color="#2E7D32" />

              <Text style={styles.photoButtonText}>Câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoButton}
              onPress={vm.pickImages}
            >
              <Feather name="image" size={22} color="#2E7D32" />

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
                  <Feather name="x" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={vm.handleRegisterBook}
            disabled={vm.loading}
            style={[styles.button, vm.loading && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={vm.loading ? ["#999", "#999"] : ["#66BB6A", "#26A69A"]}
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
                {vm.loading ? "CADASTRANDO..." : "CADASTRAR"}
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
    alignItems: "center",
    marginBottom: 40,
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

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,
    shadowRadius: 12,

    zIndex: 10,
    elevation: 10,
  },

  typeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },

  typeButton: {
    flex: 1,

    borderWidth: 2,
    borderColor: "#C8E6C9",

    borderRadius: 16,

    paddingVertical: 14,

    alignItems: "center",

    backgroundColor: "#FFF",
  },

  activeTypeButton: {
    backgroundColor: "#66BB6A",
    borderColor: "#66BB6A",
  },

  typeButtonText: {
    color: "#66BB6A",
    fontWeight: "600",
  },

  activeTypeButtonText: {
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

  descriptionContainer: {
    height: 120,
    alignItems: "flex-start",
    paddingTop: 16,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#2E7D32",
  },

  descriptionInput: {
    flex: 1,
    width: "100%",
    fontSize: 16,
    color: "#2E7D32",
    textAlignVertical: "top",
  },

  button: {
    borderRadius: 16,
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },

  photosTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 10,
  },

  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#C8E6C9",

    borderRadius: 16,

    paddingVertical: 14,

    marginBottom: 16,

    flex: 1,
  },

  photoButtonText: {
    marginLeft: 8,
    color: "#2E7D32",
    fontWeight: "600",
  },

  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  photoPreview: {
    width: 90,
    height: 90,
    borderRadius: 12,
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

    backgroundColor: "rgba(0,0,0,0.7)",

    justifyContent: "center",
    alignItems: "center",
  },

  photoButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
});
