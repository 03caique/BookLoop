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

export default function Login() {

  const vm = useLoginViewModel();

  const router = useRouter();

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8E9', '#FFFFFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>

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
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="E-mail"
              placeholderTextColor="#A5D6A7"
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
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#A5D6A7"
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
                color="#81C784"
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
                  ? ['#999', '#999']
                  : ['#66BB6A', '#26A69A']
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
                Cadastrar
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
    padding: 24,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,

    zIndex: 10,
    elevation: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#66BB6A',
    textAlign: 'center',
  },

  formContainer: {
    backgroundColor:
      'rgba(255, 255, 255, 0.9)',

    borderRadius: 24,

    padding: 24,

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

    backgroundColor: '#FFFFFF',

    borderWidth: 2,
    borderColor: '#C8E6C9',

    borderRadius: 16,

    marginBottom: 16,

    paddingHorizontal: 16,

    height: 56,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#2E7D32',
  },

  showPassword: {
    fontSize: 14,
    color: '#81C784',
    fontWeight: '500',
  },

  button: {
    borderRadius: 16,
    overflow: 'hidden',

    marginTop: 8,
    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  terms: {
    fontSize: 12,
    color: '#81C784',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: '#66BB6A',
  },

  footerLink: {
    fontSize: 14,
    color: '#26A69A',
    fontWeight: '600',
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