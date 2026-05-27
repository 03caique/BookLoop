import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { BottomNavigation } from "../components/BottomNavigation";
import { router } from "expo-router";
import { useBooksViewModel } from "../viewmodels/useBooksViewModel";

export default function Home() {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#000000");
        NavigationBar.setButtonStyleAsync("light");}, []);

    const vm = useBooksViewModel();

    if (vm.loading) {

        return (
            <View style={styles.container}>
            <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
        >

            <View style={styles.header}>

            <Text style={styles.logo}>
                BookLoop
            </Text>

            <View style={styles.headerIcons}>

                <TouchableOpacity>
                <Feather
                    name="bell"
                    size={24}
                    color="#2E7D32"
                />
                </TouchableOpacity>

                <TouchableOpacity>
                <Feather
                    name="user"
                    size={24}
                    color="#2E7D32"
                />
                </TouchableOpacity>

            </View>

            </View>

            <View style={styles.searchContainer}>

            <TextInput
                placeholder="Buscar livro ou autor"
                value={vm.search}
                onChangeText={vm.setSearch}
                style={styles.searchInput}
            />

            <TouchableOpacity
                style={styles.searchButton}
                onPress={() => router.push(`/books?query=${vm.search}`)}
            >
                <Feather
                    name="search"
                    size={20}
                    color="#FFF"
                />
            </TouchableOpacity>

            </View>

            <Text style={styles.sectionTitle}>
            Livros Recentes
            </Text>

            {vm.books.slice(0, 5).map((book) => (

                <TouchableOpacity
                    key={book.id}
                    style={styles.bookCard}
                    onPress={() => router.push(`/rbook/${book.id}`)}
                >

                    <View style={styles.bookIcon}>
                    <Feather
                        name="book"
                        size={30}
                        color="#2E7D32"
                    />
                    </View>

                    <View style={styles.bookInfo}>

                    <Text style={styles.bookTitle}>
                        {book.title}
                    </Text>

                    <Text style={styles.bookText}>
                        Autor: {book.author}
                    </Text>

                    <Text style={styles.bookText}>
                        Para: {book.status === "DOACAO"
                        ? "Doação"
                        : "Troca"}
                    </Text>

                    <Text style={styles.bookText}>
                        Dono: {book.userName}
                    </Text>

                    </View>

                </TouchableOpacity>

                ))}

            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/books")}
                >
                <Text style={styles.viewAllText}>
                    Ver Todos
                </Text>
            </TouchableOpacity>

        </ScrollView>

        <BottomNavigation />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAF8",
    },

    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 140,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    logo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#2E7D32",
    },

    headerIcons: {
        flexDirection: "row",
        gap: 16,
    },

    searchContainer: {
        flexDirection: "row",
        marginBottom: 24,
    },

    searchInput: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#C8E6C9",
    },

    searchButton: {
        width: 50,
        height: 50,
        marginLeft: 10,
        borderRadius: 16,
        backgroundColor: "#26a69a",
        justifyContent: "center",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2E7D32",
        marginBottom: 16,
    },

    bookCard: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },

    bookIcon: {
        width: 70,
        height: 70,
        borderRadius: 16,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
    },

    bookInfo: {
        flex: 1,
        marginLeft: 16,
    },

    bookTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2E7D32",
        marginBottom: 8,
    },

    bookText: {
        color: "#555",
        marginBottom: 2,
    },

    viewAllButton: {
        alignSelf: "center",
        backgroundColor: "#26a69a",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        marginTop: 10,
    },

    viewAllText: {
        color: "#FFF",
        fontWeight: "600",
    },

    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        height: 70,

        backgroundColor: "#FFF",

        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },

});
