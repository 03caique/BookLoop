import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLoginViewModel } from '../viewmodels/useLoginViewModel';
import { Palette, Radius, Spacing, FontSize } from '../constants/theme';

export default function Login() {

  const vm = useLoginViewModel();

  const router = useRouter();

  return (
    <LinearGradient
      colors={[Palette.gradientStart, Palette.gradientMid, Palette.white]}
      style={styles.gradient}
    >
      <View style={styles.container}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={Palette.primaryDark}
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>
            Fazer Login
          </Text>
        </View>

        <View style={styles.formContainer}>

          <View style={styles.inputContainer}>

            <Feather
              name="mail"
              size={20}
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="E-mail"
              placeholderTextColor={Palette.placeholder}
              value={vm.email}
              onChangeText={vm.setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={!vm.loading}
            />

          </View>

          <View style={styles.inputContainer}>

            <Feather
              name="lock"
              size={20}
              color={Palette.primaryLight}
              style={styles.icon}
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor={Palette.placeholder}
              value={vm.password}
              onChangeText={vm.setPassword}
              secureTextEntry={!vm.showPassword}
              style={styles.input}
              editable={!vm.loading}
            />

            <TouchableOpacity
              onPress={() =>
                vm.setShowPassword(
                  !vm.showPassword
                )
              }
            >

              <Feather
                name={
                  vm.showPassword
                    ? "eye-off"
                    : "eye"
                }
                size={20}
                color={Palette.primaryLight}
              />

            </TouchableOpacity>

          </View>

          <TouchableOpacity
            onPress={vm.handleLogin}
            disabled={vm.loading}
            style={[
              styles.button,
              vm.loading &&
              styles.buttonDisabled
            ]}
          >

            <LinearGradient
              colors={
                vm.loading
                  ? [Palette.disabled, Palette.disabled]
                  : [Palette.primary, Palette.secondary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >

              <Text style={styles.buttonText}>
                {
                  vm.loading
                    ? 'ENTRANDO...'
                    : 'ENTRAR'
                }
              </Text>

            </LinearGradient>

          </TouchableOpacity>

          <View style={styles.footer}>

            <Text style={styles.footerText}>
              Ainda não possui uma conta? 
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push('/register')
              }
            >

              <Text style={styles.footerLink}>
                {' '}Cadastrar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

        <View style={styles.blob1} />
        <View style={styles.blobOutline1} />

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
    padding: Spacing.xl,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Palette.primaryDark,
    marginBottom: Spacing.sm,

    zIndex: 10,
    elevation: 10,
  },

  subtitle: {
    fontSize: 16,
    color: Palette.primary,
    textAlign: 'center',
  },

  formContainer: {
    backgroundColor: Palette.formBackground,

    borderRadius: Radius.xl,

    padding: Spacing.xl,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,
    shadowRadius: 12,

    zIndex: 10,
    elevation: 10,
  },

  inputContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: Palette.white,

    borderWidth: 2,
    borderColor: Palette.borderLight,

    borderRadius: Radius.md,

    marginBottom: Spacing.md,

    paddingHorizontal: Spacing.md,

    height: 56,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Palette.primaryDark,
  },

  showPassword: {
    fontSize: 14,
    color: Palette.primaryLight,
    fontWeight: '500',
  },

  button: {
    borderRadius: Radius.md,
    overflow: 'hidden',

    marginTop: 8,
    marginBottom: Spacing.md,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  terms: {
    fontSize: 12,
    color: Palette.primaryLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: Palette.primary,
  },

  footerLink: {
    fontSize: 14,
    color: Palette.secondary,
    fontWeight: '600',
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

  backButton: {
    position: "absolute",

    top: 60,

    left: Spacing.xl,

    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: Palette.backButtonBackground,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,

    elevation: 10,
  },
});