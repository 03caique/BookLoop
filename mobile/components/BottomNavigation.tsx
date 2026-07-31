import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function BottomNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNav, { bottom: insets.bottom + 8 }]}>
      <TouchableOpacity onPress={() => router.replace("/home")}>
        <Feather
          name="home"
          size={26}
          color={pathname === "/home" ? "#2E7D32" : "#9E9E9E"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/books")}>
        <Feather
          name="book"
          size={26}
          color={pathname === "/books" ? "#2E7D32" : "#9E9E9E"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/book-register")}>
        <Feather
          name="plus-circle"
          size={26}
          color={pathname === "/book-register" ? "#2E7D32" : "#9E9E9E"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/matches")}>
        <Feather
          name="repeat"
          size={26}
          color={pathname === "/matches" ? "#2E7D32" : "#9E9E9E"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 65,
    backgroundColor: "#FFF",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
  },
});