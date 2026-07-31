import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBookDetailsViewModel } from "../../viewmodels/useBookDetailsViewModel";
import { useBookRequestViewModel } from "../../viewmodels/useBookRequestViewModel";
import { Palette, Radius, Spacing, FontSize } from "../../constants/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CARD_MARGIN = 20;

export default function BookDetails() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const { requestSent, errorMessage, handleRequestBook } =
    useBookRequestViewModel();

  const { id } = useLocalSearchParams();
  const { book, loading } = useBookDetailsViewModel(Number(id));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.secondary} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFoundText}>Livro não encontrado</Text>
      </View>
    );
  }

  const hasPhotos = book.photos?.length > 0;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[Palette.primary, Palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.appBar, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/books")
            }
          >
            <Feather name="arrow-left" size={26} color={Palette.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Detalhes do livro</Text>

          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carrossel de imagens */}
        <View style={styles.carouselWrapper}>
          {hasPhotos ? (
            <>
              <FlatList
                data={book.photos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(photo) => photo.id.toString()}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth,
                  );
                  setCurrentImage(index);
                }}
                renderItem={({ item: photo, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.imageSlide}
                    onPress={() => openViewer(index)}
                  >
                    <Image
                      source={{
                        uri: `${process.env.EXPO_PUBLIC_API_URL}${photo.imageUrl}`,
                      }}
                      style={styles.bookImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />

              {book.photos.length > 1 && (
                <View style={styles.indicators}>
                  {book.photos.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        currentImage === index && styles.activeIndicator,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.imageSlide}>
              <View style={[styles.bookImage, styles.imagePlaceholder]}>
                <Text style={styles.placeholderText}>Sem foto</Text>
              </View>
            </View>
          )}
        </View>

        {/* Card de informações */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{book.title}</Text>
            <View
              style={[
                styles.badge,
                book.status === "DOACAO"
                  ? styles.badgeDoacao
                  : styles.badgeTroca,
              ]}
            >
              <Text style={styles.badgeText}>
                {book.status === "DOACAO" ? "Para Doação" : "Para Troca"}
              </Text>
            </View>
          </View>

          <Text style={styles.author}>{book.author}</Text>

          <View style={styles.divider} />

          <View style={styles.infoBlock}>
            <Text style={styles.label}>ISBN</Text>
            <Text style={styles.text}>{book.isbn || "Não informado"}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Estado do livro</Text>
            <Text style={styles.text}>
              {book.condition === "NOVO"
                ? "Novo"
                : book.condition === "SEMINOVO"
                  ? "Seminovo"
                  : book.condition === "BOM"
                    ? "Bom"
                    : book.condition === "REGULAR"
                      ? "Regular"
                      : "Ruim"}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Descrição</Text>
            <Text style={styles.text}>{book.description}</Text>
          </View>

          <View style={styles.ownerRow}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerInitial}>
                {book.userName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Dono</Text>
              <Text style={styles.text}>{book.userName}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, requestSent && styles.buttonDisabled]}
            disabled={requestSent}
            activeOpacity={0.8}
            onPress={() => handleRequestBook(book.id!, book.userId!)}
          >
            <Text style={styles.buttonText}>
              {requestSent ? "Solicitação enviada" : "Solicitar livro"}
            </Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Visualizador em tela cheia */}
      <Modal
        visible={viewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <StatusBar hidden />
        <View style={styles.viewerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setViewerVisible(false)}
          >
            <Ionicons name="close" size={30} color={Palette.white} />
          </TouchableOpacity>

          <FlatList
            data={book.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(photo) => photo.id.toString()}
            initialScrollIndex={viewerIndex}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth,
              );
              setViewerIndex(index);
            }}
            renderItem={({ item: photo }) => (
              <View style={styles.viewerSlide}>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_API_URL}${photo.imageUrl}`,
                  }}
                  style={styles.viewerImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {book.photos?.length > 1 && (
            <View style={styles.viewerIndicators}>
              {book.photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.viewerIndicator,
                    viewerIndex === index && styles.viewerIndicatorActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  appBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
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
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Palette.white,
  },

  scrollContent: {
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Palette.background,
  },

  notFoundText: {
    fontSize: 16,
    color: Palette.textMutedAlt,
  },

  carouselWrapper: {
    marginTop: Spacing.md,
  },

  imageSlide: {
    width: screenWidth,
    paddingHorizontal: CARD_MARGIN,
  },

  bookImage: {
    width: "100%",
    height: 280,
    borderRadius: Radius.lg - 8, // 20
  },

  imagePlaceholder: {
    backgroundColor: Palette.imagePlaceholderBg,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: Palette.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.md,
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.borderLight,
    marginHorizontal: 3,
  },

  activeIndicator: {
    backgroundColor: Palette.primaryDark,
    width: 18,
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    marginHorizontal: CARD_MARGIN,
    elevation: 4,
    shadowColor: Palette.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: Palette.primaryDark,
    marginRight: 12,
  },

  author: {
    fontSize: 15,
    color: Palette.authorAccent,
    fontWeight: "600",
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },

  badgeDoacao: {
    backgroundColor: Palette.badgeDoacaoBg,
  },

  badgeTroca: {
    backgroundColor: Palette.badgeTrocaBg,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Palette.primaryDark,
  },

  divider: {
    height: 1,
    backgroundColor: Palette.border,
    marginVertical: Spacing.lg,
  },

  infoBlock: {
    marginBottom: Spacing.md,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: Palette.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  text: {
    fontSize: 16,
    color: Palette.textBody,
    lineHeight: 24,
  },

  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: Spacing.xl,
  },

  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  ownerInitial: {
    color: Palette.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  button: {
    backgroundColor: Palette.primary,
    paddingVertical: 16,
    borderRadius: Radius.md - 2, // 14
    alignItems: "center",
    shadowColor: Palette.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  buttonText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonDisabled: {
    backgroundColor: Palette.disabled,
    shadowOpacity: 0,
  },

  errorText: {
    color: Palette.danger,
    marginTop: Spacing.md,
    textAlign: "center",
    fontWeight: "bold",
  },

  // Visualizador em tela cheia
  viewerContainer: {
    flex: 1,
    backgroundColor: Palette.viewerBg,
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: Spacing.lg,
    zIndex: 10,
    backgroundColor: Palette.viewerOverlay,
    borderRadius: 20,
    padding: 6,
  },

  viewerSlide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },

  viewerImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },

  viewerIndicators: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  viewerIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.viewerDotInactive,
    marginHorizontal: 3,
  },

  viewerIndicatorActive: {
    backgroundColor: Palette.white,
    width: 18,
  },
});