import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
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
import { useBookDetailsViewModel } from "../../viewmodels/useBookDetailsViewModel";
import { useBookRequestViewModel } from "../../viewmodels/useBookRequestViewModel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CARD_MARGIN = 20;

export default function BookDetails() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { requestSent, errorMessage, handleRequestBook } =
    useBookRequestViewModel();

  const { id } = useLocalSearchParams();
  const { book, loading } = useBookDetailsViewModel(Number(id));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
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
    <LinearGradient
      colors={["#E8F5E9", "#F1F8E9", "#FFFFFF"]}
      style={styles.container}
    >
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
                {book.status === "DOACAO" ? "Doação" : "Troca"}
              </Text>
            </View>
          </View>

          <Text style={styles.author}>{book.author}</Text>

          <View style={styles.divider} />

          <View style={styles.infoBlock}>
            <Text style={styles.label}>ISBN</Text>
            <Text style={styles.text}>{book.isbn}</Text>
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
            <Ionicons name="close" size={30} color="#FFF" />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
  },

  notFoundText: {
    fontSize: 16,
    color: "#666",
  },

  carouselWrapper: {
    marginTop: 12,
  },

  imageSlide: {
    width: screenWidth,
    paddingHorizontal: CARD_MARGIN,
  },

  bookImage: {
    width: "100%",
    height: 280,
    borderRadius: 20,
  },

  imagePlaceholder: {
    backgroundColor: "#DCEDC8",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#66BB6A",
    fontSize: 14,
    fontWeight: "600",
  },

  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#C8E6C9",
    marginHorizontal: 3,
  },

  activeIndicator: {
    backgroundColor: "#2E7D32",
    width: 18,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    marginHorizontal: CARD_MARGIN,
    elevation: 4,
    shadowColor: "#2E7D32",
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
    color: "#2E7D32",
    marginRight: 12,
  },

  author: {
    fontSize: 15,
    color: "#7CB342",
    fontWeight: "600",
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeDoacao: {
    backgroundColor: "#C8E6C9",
  },

  badgeTroca: {
    backgroundColor: "#DCEDC8",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },

  infoBlock: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#66BB6A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },

  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },

  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#66BB6A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  ownerInitial: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  button: {
    backgroundColor: "#66BB6A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#66BB6A",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0,
  },

  errorText: {
    color: "#D32F2F",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "bold",
  },

  // Visualizador em tela cheia
  viewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
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
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 3,
  },

  viewerIndicatorActive: {
    backgroundColor: "#FFF",
    width: 18,
  },
});
