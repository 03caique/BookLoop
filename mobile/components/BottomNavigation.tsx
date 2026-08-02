import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette, Radius } from "../constants/theme";


export function BottomNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNav, { bottom: insets.bottom + 8 }]}>
      <TouchableOpacity onPress={() => router.replace("/home")}>
        <Feather
          name="home"
          size={26}
          color={pathname === "/home" ? Palette.primaryDark : Palette.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/books")}>
        <Feather
          name="book"
          size={26}
          color={pathname === "/books" ? Palette.primaryDark : Palette.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/book-register")}>
        <Feather
          name="plus-circle"
          size={26}
          color={
            pathname === "/book-register"
              ? Palette.primaryDark
              : Palette.textMuted
          }
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/transactions")}>
        <Feather
          name="repeat"
          size={26}
          color={
            pathname === "/transactions"
              ? Palette.primaryDark
              : Palette.textMuted
          }
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
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});