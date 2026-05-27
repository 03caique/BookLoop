import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function BottomNavigation() {

  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>

      <TouchableOpacity
        onPress={() => router.replace("/home")}
      >
        <Feather
          name="home"
          size={26}
          color={
            pathname === "/home"
              ? "#2E7D32"
              : "#9E9E9E"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/books")}
      >
        <Feather
          name="book"
          size={26}
          color={
            pathname === "/books"
              ? "#2E7D32"
              : "#9E9E9E"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/book-register")}
      >
        <Feather
          name="plus-circle"
          size={26}
          color={
            pathname === "/book-register"
              ? "#2E7D32"
              : "#9E9E9E"
          }
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  bottomNav: {
    position: "absolute",

    left: 16,
    right: 16,
    bottom: 40,

    height: 65,

    backgroundColor: "#FFF",

    borderRadius: 20,

    flexDirection: "row",

    justifyContent: "space-around",

    alignItems: "center",

    elevation: 10,
  },

});