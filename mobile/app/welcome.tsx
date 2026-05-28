import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {

  const router = useRouter();

  return (

    <LinearGradient
      colors={[
        "#E8F5E9",
        "#F1F8E9",
        "#FFFFFF"
      ]}
      style={styles.gradient}
    >

      <View style={styles.container}>

        <View style={styles.logoContainer}>

          <Feather
            name="book-open"
            size={70}
            color="#2E7D32"
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
                "#66BB6A",
                "#26A69A"
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
    padding: 32,
  },

  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 16,
  },

  subtitle: {
    fontSize: 18,
    color: "#66BB6A",
    marginTop: 4,
  },

  buttonsContainer: {
    marginBottom: 185,
  },

  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  outlineButton: {
    borderWidth: 2,
    borderColor: "#66BB6A",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  outlineButtonText: {
    color: "#66BB6A",
    fontSize: 16,
    fontWeight: "700",
  },

    blob1: {
    position: "absolute",

    width: 220,
    height: 220,

    backgroundColor:
      "rgba(38, 166, 154, 0.12)",

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

    borderColor:
      "rgba(38, 166, 154, 0.45)",

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

    backgroundColor:
      "rgba(102, 187, 106, 0.18)",

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

    borderColor:
      "rgba(46, 125, 50, 0.5)",

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