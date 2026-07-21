import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useChatViewModel } from "../viewmodels/useChatViewModel";

export default function Chat() {
  const { receiverId, receiverName } = useLocalSearchParams<{
    receiverId: string;
    receiverName?: string;
  }>();
  const { userId } = useAuth();
  const vm = useChatViewModel(Number(receiverId));
  const router = useRouter();

  if (vm.loading && vm.messages.length === 0) {
    return (
      <LinearGradient
        colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#2E7D32" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={26} color="#2E7D32" />
          </TouchableOpacity>

          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {(receiverName?.charAt(0) ?? "?").toUpperCase()}
            </Text>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>{receiverName ?? "Chat"}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <FlatList
            data={[...vm.messages].reverse()}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={({ item }) => {
              const isMine = item.senderId === userId;
              return (
                <View
                  style={[
                    styles.messageRow,
                    isMine ? styles.rowSent : styles.rowReceived,
                  ]}
                >
                  <View
                    style={[
                      styles.message,
                      isMine ? styles.sentMessage : styles.receivedMessage,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMine ? styles.sentText : styles.receivedText,
                      ]}
                    >
                      {item.content}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Digite uma mensagem..."
              placeholderTextColor="#9CBFA1"
              value={vm.message}
              onChangeText={vm.setMessage}
              style={styles.input}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !vm.message?.trim() && styles.sendButtonDisabled,
              ]}
              onPress={vm.handleSendMessage}
              disabled={vm.loading || !vm.message.trim()}
              activeOpacity={0.8}
            >
              <Feather name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  flexFill: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#2E7D32",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  backButton: {
    marginRight: 8,
    padding: 4,
  },

  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#66BB6A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerAvatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 17,
  },

  headerTextWrapper: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#7CB342",
    marginTop: 2,
  },

  // Corpo
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  messagesContainer: {
    paddingTop: 12,
    paddingBottom: 16,
  },

  messageRow: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
  },

  rowSent: {
    justifyContent: "flex-end",
  },

  rowReceived: {
    justifyContent: "flex-start",
  },

  message: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    elevation: 1,
    shadowColor: "#2E7D32",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  sentMessage: {
    backgroundColor: "#66BB6A",
    borderBottomRightRadius: 4,
  },

  receivedMessage: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 21,
  },

  sentText: {
    color: "#FFFFFF",
  },

  receivedText: {
    color: "#2E2E2E",
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 2,
    borderColor: "#C8E6C9",
    borderRadius: 24,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
    marginTop: 6,
  },

  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 10,
    fontSize: 16,
    color: "#2E7D32",
  },

  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#66BB6A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 4,
    shadowColor: "#66BB6A",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sendButtonDisabled: {
    backgroundColor: "#A5C6A8",
    shadowOpacity: 0,
  },
});