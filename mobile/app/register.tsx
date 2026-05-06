import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'E-mail inválido');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        let errorMessage = 'Erro ao cadastrar usuário';
        
        if (response.status === 409) {
          errorMessage = 'Este e-mail já está cadastrado';
        } else if (response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente';
        } else if (response.status === 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde';
        }
        
        Alert.alert('Erro', errorMessage);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8E9', '#FFFFFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Crie Sua Conta</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#81C784" style={styles.icon} />
            <TextInput
              placeholder="Nome Completo"
              placeholderTextColor="#A5D6A7"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#81C784" style={styles.icon} />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor="#A5D6A7"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={!loading}
            />
          </View>

         <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#81C784" style={styles.icon} />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#A5D6A7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} // 👈 controla aqui
              style={styles.input}
              editable={!loading}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye-off" : "eye"} // 👈 troca o ícone
                size={20}
                color="#81C784"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#81C784" style={styles.icon} />
            <TextInput
              placeholder="Confirmar Senha"
              placeholderTextColor="#A5D6A7"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={loading ? ['#999', '#999'] : ['#66BB6A', '#26A69A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  },
  subtitle: {
    fontSize: 16,
    color: '#66BB6A',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
});