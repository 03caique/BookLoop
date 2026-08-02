import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookCard } from "../components/BookCard";
import { BottomNavigation } from "../components/BottomNavigation";
import { FontSize, Palette, Radius, Spacing } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useProfileViewModel } from "../viewmodels/useProfileViewModel";

export default function Profile() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const vm = useProfileViewModel();

  async function handleLogout() {
    if (Platform.OS === "web") {
      await signOut();
      router.replace("/welcome");
      return;
    }

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
        <ActivityIndicator size="large" color={Palette.secondary} />
      </View>
    );
  }

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

          <Text style={styles.title}>Meu Perfil</Text>

          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Feather name="user" size={70} color={Palette.primaryDark} />
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
                  const emailChanged = await vm.handleUpdate();

                  if (emailChanged) {
                    await signOut();

                    Alert.alert(
                      "E-mail alterado",
                      "Seu e-mail foi alterado. Faça login novamente.",
                      [
                        {
                          text: "OK",
                          onPress: () => router.replace("/welcome"),
                        },
                      ],
                    );

                    return;
                  }

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
                <Feather name="edit-2" size={22} color={Palette.primaryDark} />

                <Text style={styles.menuText}>Editar Perfil</Text>
              </View>

              <Feather
                name="chevron-right"
                size={22}
                color={Palette.disabled}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/socioeconomic-profile")}
            >
              <View style={styles.menuLeft}>
                <Feather
                  name="bar-chart-2"
                  size={22}
                  color={Palette.primaryDark}
                />

                <Text style={styles.menuText}>Perfil Socioeconômico</Text>
              </View>

              <Feather
                name="chevron-right"
                size={22}
                color={Palette.disabled}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/my-requests")}
            >
              <View style={styles.menuLeft}>
                <Feather name="repeat" size={22} color={Palette.primaryDark} />

                <Text style={styles.menuText}>Minhas solicitações</Text>
              </View>

              <Feather
                name="chevron-right"
                size={22}
                color={Palette.disabled}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/book-requests")}
            >
              <View style={styles.menuLeft}>
                <Feather name="inbox" size={22} color={Palette.primaryDark} />

                <Text style={styles.menuText}>Solicitações recebidas</Text>
              </View>

              <Feather
                name="chevron-right"
                size={22}
                color={Palette.disabled}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/transaction-history")}
            >
              <View style={styles.menuLeft}>
                <Feather name="clock" size={22} color={Palette.primaryDark} />

                <Text style={styles.menuText}>Histórico de transações</Text>
              </View>

              <Feather
                name="chevron-right"
                size={22}
                color={Palette.disabled}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuLeft}>
                <Feather name="log-out" size={22} color={Palette.danger} />
                <Text style={[styles.menuText, { color: Palette.danger }]}>
                  Sair
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.booksTitle}>Meus Livros</Text>

        {vm.books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPress={() => router.push(`/book/${book.id}`)}
            showEditButton
            onEdit={() =>
              router.push({
                pathname: "/book-register",
                params: {
                  id: String(book.id),
                },
              })
            }
            showDeleteButton
            onDelete={() => vm.handleDeleteBook(book.id!)}
          />
        ))}
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

  content: {
    padding: Spacing.xl,
    paddingBottom: 140,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Palette.background,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl + 8, // 32
    marginTop: Spacing.md,
  },

  avatar: {
    width: 140,
    height: 140,

    borderRadius: 70,

    backgroundColor: Palette.white,

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    marginBottom: Spacing.lg,
  },

  name: {
    fontSize: 34,
    fontWeight: "700",
    color: Palette.primaryDark,
  },

  email: {
    fontSize: 15,
    color: Palette.textFaint,
    marginTop: 6,
  },

  editInput: {
    width: "100%",

    backgroundColor: Palette.white,

    borderWidth: 1,
    borderColor: Palette.borderLight,

    borderRadius: Radius.md,

    paddingHorizontal: Spacing.md,
    paddingVertical: 14,

    fontSize: 16,

    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: Palette.secondary,

    paddingVertical: 16,
    paddingHorizontal: Spacing.xl + 8, // 32

    borderRadius: Radius.md,

    marginTop: 10,
  },

  saveButtonText: {
    color: Palette.white,
    fontWeight: "700",
    fontSize: 16,
  },

  menuContainer: {
    backgroundColor: Palette.white,

    borderRadius: Radius.xl,

    overflow: "hidden",

    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    marginBottom: Spacing.xl + 8, // 32
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,

    borderBottomWidth: 1,
    borderBottomColor: Palette.menuBorder,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    fontSize: 18,
    marginLeft: Spacing.md,
    color: Palette.textDark,
  },

  booksTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Palette.primaryDark,

    marginBottom: Spacing.lg,
  },
});
