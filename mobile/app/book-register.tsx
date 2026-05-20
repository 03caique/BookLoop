import { Feather } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useBookRegisterViewModel
} from '../viewmodels/useBookRegisterViewModel';

export default function BookRegister() {

  const vm =
    useBookRegisterViewModel();

  return (

    <LinearGradient
      colors={[
        '#E8F5E9',
        '#F1F8E9',
        '#FFFFFF'
      ]}
      style={styles.gradient}
    >

      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.title}>
            Cadastrar Livro
          </Text>

        </View>

        <View style={styles.formContainer}>

          <View style={styles.typeContainer}>

            <TouchableOpacity
              style={[
                styles.typeButton,

                vm.status === 'DOACAO' &&
                styles.activeTypeButton
              ]}

              onPress={() =>
                vm.setStatus('DOACAO')
              }
            >

              <Text
                style={[
                  styles.typeButtonText,

                  vm.status === 'DOACAO' &&
                  styles.activeTypeButtonText
                ]}
              >
                Doação
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,

                vm.status === 'TROCA' &&
                styles.activeTypeButton
              ]}

              onPress={() =>
                vm.setStatus('TROCA')
              }
            >

              <Text
                style={[
                  styles.typeButtonText,

                  vm.status === 'TROCA' &&
                  styles.activeTypeButtonText
                ]}
              >
                Troca
              </Text>

            </TouchableOpacity>

          </View>

          <View style={styles.inputContainer}>

            <Feather
              name="book"
              size={20}
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Titulo"
              placeholderTextColor="#A5D6A7"
              value={vm.title}
              onChangeText={vm.setTitle}
              style={styles.input}
              editable={!vm.loading}
            />

          </View>

          <View style={styles.inputContainer}>

            <Feather
              name="edit"
              size={20}
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="Autor"
              placeholderTextColor="#A5D6A7"
              value={vm.author}
              onChangeText={vm.setAuthor}
              style={styles.input}
              editable={!vm.loading}
            />

          </View>

          <View style={styles.inputContainer}>

            <Feather
              name="hash"
              size={20}
              color="#81C784"
              style={styles.icon}
            />

            <TextInput
              placeholder="ISBN"
              placeholderTextColor="#A5D6A7"
              value={vm.isbn}
              onChangeText={vm.setIsbn}
              style={styles.input}
              editable={!vm.loading}
            />

          </View>

          <View
            style={[
              styles.inputContainer,
              styles.descriptionContainer
            ]}
          >

            <TextInput
              placeholder="Descrição"
              placeholderTextColor="#A5D6A7"
              value={vm.description}
              onChangeText={vm.setDescription}
              multiline
              style={styles.descriptionInput}
              editable={!vm.loading}
            />

          </View>

          <TouchableOpacity
            onPress={
              vm.handleRegisterBook
            }

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

              start={{
                x: 0,
                y: 0
              }}

              end={{
                x: 1,
                y: 0
              }}

              style={styles.buttonGradient}
            >

              <Text style={styles.buttonText}>

                {
                  vm.loading
                    ? 'CADASTRANDO...'
                    : 'CADASTRAR'
                }

              </Text>

            </LinearGradient>

          </TouchableOpacity>

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
  },

  formContainer: {
    backgroundColor:
      'rgba(255,255,255,0.9)',

    borderRadius: 24,

    padding: 24,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 5,
  },

  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },

  typeButton: {
    flex: 1,

    borderWidth: 2,
    borderColor: '#C8E6C9',

    borderRadius: 16,

    paddingVertical: 14,

    alignItems: 'center',

    backgroundColor: '#FFF',
  },

  activeTypeButton: {
    backgroundColor: '#66BB6A',
    borderColor: '#66BB6A',
  },

  typeButtonText: {
    color: '#66BB6A',
    fontWeight: '600',
  },

  activeTypeButtonText: {
    color: '#FFF',
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

  descriptionContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 16,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#2E7D32',
  },

  descriptionInput: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    color: '#2E7D32',
    textAlignVertical: 'top',
  },

  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
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
});