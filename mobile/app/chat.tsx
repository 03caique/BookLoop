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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette, Radius, Spacing } from "../constants/theme";
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
  const insets = useSafeAreaInsets();

  if (vm.loading && vm.messages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <LinearGradient
          colors={[Palette.primary, Palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/matches")
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={26} color={Palette.white} />
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
        </LinearGradient>

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
              placeholderTextColor={Palette.chatPlaceholder}
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
              <Feather name="send" size={20} color={Palette.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  flexFill: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Palette.background,
  },

  appBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 8,
    padding: 4,
  },

  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.overlay,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerAvatarText: {
    color: Palette.secondary,
    fontWeight: "bold",
    fontSize: 17,
  },

  headerTextWrapper: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: Palette.white,
  },

  headerSubtitle: {
    fontSize: 12,
    color: Palette.white,
    marginTop: 2,
  },

  // Corpo
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },

  messagesContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
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
    shadowColor: Palette.primaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  sentMessage: {
    backgroundColor: Palette.primary,
    borderBottomRightRadius: 4,
  },

  receivedMessage: {
    backgroundColor: Palette.white,
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 21,
  },

  sentText: {
    color: Palette.white,
  },

  receivedText: {
    color: Palette.textDarkAlt,
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 2,
    borderColor: Palette.borderLight,
    borderRadius: Radius.lg - 4, // 24
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginBottom: Spacing.md,
    marginTop: 6,
  },

  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 10,
    fontSize: 16,
    color: Palette.primaryDark,
  },

  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 4,
    shadowColor: Palette.primary,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sendButtonDisabled: {
    backgroundColor: Palette.sendDisabled,
    shadowOpacity: 0,
  },
});
