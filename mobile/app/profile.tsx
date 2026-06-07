import { Feather } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { BottomNavigation } from "../components/BottomNavigation";

import { useProfileViewModel } from "../viewmodels/useProfileViewModel";

import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { signOut } = useAuth();

  const vm = useProfileViewModel();

  async function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();

          router.replace("/welcome");
        },
      },
    ]);
  }

  if (vm.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={30} color="#2E7D32" />
          </TouchableOpacity>

          <Text style={styles.title}>Meu Perfil</Text>

          <View style={{ width: 30 }} />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Feather name="user" size={70} color="#2E7D32" />
          </View>

          {vm.editing ? (
            <>
              <TextInput
                value={vm.name}
                onChangeText={vm.setName}
                style={styles.editInput}
                placeholder="Nome"
              />

              <TextInput
                value={vm.email}
                onChangeText={vm.setEmail}
                style={styles.editInput}
                placeholder="E-mail"
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                  await vm.handleUpdate();

                  vm.setEditing(false);
                }}
              >
                <Text style={styles.saveButtonText}>SALVAR</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.name}>{vm.name}</Text>

              <Text style={styles.email}>{vm.email}</Text>
            </>
          )}
        </View>

        {!vm.editing && (
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => vm.setEditing(true)}
            >
              <View style={styles.menuLeft}>
                <Feather name="edit-2" size={22} color="#2E7D32" />

                <Text style={styles.menuText}>Editar Perfil</Text>
              </View>

              <Feather name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/socioeconomic-profile")}
            >
              <View style={styles.menuLeft}>
                <Feather name="bar-chart-2" size={22} color="#2E7D32" />

                <Text style={styles.menuText}>Perfil Socioeconômico</Text>
              </View>

              <Feather name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Feather name="repeat" size={22} color="#2E7D32" />

                <Text style={styles.menuText}>Minhas solicitações</Text>
              </View>

              <Feather name="chevron-right" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <View style={styles.menuLeft}>
                <Feather name="log-out" size={22} color="#D32F2F" />

                <Text style={[styles.menuText, { color: "#D32F2F" }]}>
                  Sair
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.booksTitle}>Meus Livros</Text>

        {vm.books.map((book) => (
          <View key={book.id} style={styles.bookCard}>
            <View style={styles.bookImage}>
              <Feather name="book" size={40} color="#2E7D32" />
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>

              <Text style={styles.bookText}>{book.author}</Text>

              <Text style={styles.bookText}>ISBN: {book.isbn}</Text>

              <Text style={styles.bookText}>
                {book.status === "DOACAO" ? "Para doação" : "Para troca"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 140,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E7D32",
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  avatar: {
    width: 140,
    height: 140,

    borderRadius: 70,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    marginBottom: 20,
  },

  name: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2E7D32",
  },

  email: {
    fontSize: 15,
    color: "#777",
    marginTop: 6,
  },

  editInput: {
    width: "100%",

    backgroundColor: "#FFF",

    borderWidth: 1,
    borderColor: "#C8E6C9",

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: 14,

    fontSize: 16,

    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#26A69A",

    paddingVertical: 16,
    paddingHorizontal: 32,

    borderRadius: 16,

    marginTop: 10,
  },

  saveButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  menuContainer: {
    backgroundColor: "#FFF",

    borderRadius: 24,

    overflow: "hidden",

    elevation: 3,

    marginBottom: 32,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 20,

    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    fontSize: 18,
    marginLeft: 16,
    color: "#222",
  },

  booksTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",

    marginBottom: 20,
  },

  bookCard: {
    flexDirection: "row",

    backgroundColor: "#FFF",

    borderRadius: 24,

    padding: 16,

    marginBottom: 16,

    elevation: 3,
  },

  bookImage: {
    width: 100,
    height: 130,

    borderRadius: 20,

    backgroundColor: "#E8F5E9",

    justifyContent: "center",
    alignItems: "center",
  },

  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },

  bookTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },

  bookText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
});
