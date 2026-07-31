import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Palette, Radius, Spacing, FontSize } from "../constants/theme";

export default function Home() {

  const router = useRouter();

  return (

    <LinearGradient
      colors={[
        Palette.gradientStart,
        Palette.gradientMid,
        Palette.white,
      ]}
      style={styles.gradient}
    >

      <View style={styles.container}>

        <View style={styles.logoContainer}>

          <Feather
            name="book-open"
            size={70}
            color={Palette.primaryDark}
          />

          <Text style={styles.title}>
            BookLoop
          </Text>

          <Text style={styles.subtitle}>
            Troque histórias.
          </Text>

          <Text style={styles.subtitle}>
            Compartilhe conhecimento.
          </Text>

        </View>

        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push("/login")
            }
          >

            <LinearGradient
              colors={[
                Palette.primary,
                Palette.secondary,
              ]}
              style={styles.buttonGradient}
            >

              <Text style={styles.buttonText}>
                Entrar
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              router.push("/register")
            }
          >

            <Text
              style={styles.outlineButtonText}
            >
              Criar Conta
            </Text>

          </TouchableOpacity>

        </View>

        <View style={styles.blob1}/>
        <View style={styles.blobOutline1}/>

        <View style={styles.blob2}/>
        <View style={styles.blobOutline2}/>

      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: Spacing.xl + 8, // 32
  },

  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    color: Palette.primaryDark,
    marginTop: Spacing.md,
  },

  subtitle: {
    fontSize: 18,
    color: Palette.primary,
    marginTop: 4,
  },

  buttonsContainer: {
    marginBottom: 185,
  },

  button: {
    borderRadius: Radius.md,
    overflow: "hidden",
    marginBottom: Spacing.md,
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

  outlineButton: {
    borderWidth: 2,
    borderColor: Palette.primary,
    borderRadius: Radius.md,
    paddingVertical: 18,
    alignItems: "center",
  },

  outlineButtonText: {
    color: Palette.primary,
    fontSize: 16,
    fontWeight: "700",
  },

    blob1: {
    position: "absolute",

    width: 220,
    height: 220,

    backgroundColor: Palette.blobSecondary,

    top: -40,
    right: -60,

    borderRadius: 80,

    transform: [
      { rotate: "15deg" }
    ],

    zIndex: 0,
  },

  blobOutline1: {
    position: "absolute",

    width: 220,
    height: 220,

    borderWidth: 2,

    borderColor: Palette.blobSecondaryOutline,

    top: -48,
    right: -52,

    borderRadius: 90,

    transform: [
      { rotate: "8deg" }
    ],

    backgroundColor: "transparent",

    zIndex: 0,
  },

  blob2: {
    position: "absolute",

    width: 260,
    height: 260,

    backgroundColor: Palette.blobPrimary,

    bottom: -80,
    left: -90,

    borderTopLeftRadius: 120,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 140,

    transform: [
      { rotate: "-20deg" }
    ],

    zIndex: 0,
  },

  blobOutline2: {
    position: "absolute",

    width: 260,
    height: 260,

    borderWidth: 2,

    borderColor: Palette.blobPrimaryOutline,

    bottom: -70,
    left: -80,

    borderTopLeftRadius: 100,
    borderTopRightRadius: 120,
    borderBottomLeftRadius: 140,
    borderBottomRightRadius: 90,

    transform: [
      { rotate: "-10deg" }
    ],

    backgroundColor: "transparent",

    zIndex: 0,
  },
});