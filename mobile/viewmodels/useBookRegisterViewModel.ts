import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  findBookByIsbn,
  getBookById,
  registerBook,
  updateBook,
  uploadBookPhoto,
} from "../services/bookService";

export function useBookRegisterViewModel() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"DOACAO" | "TROCA">("DOACAO");
  const [condition, setCondition] = useState<
    "NOVO" | "SEMINOVO" | "BOM" | "REGULAR" | "RUIM"
  >("BOM");
  const [photos, setPhotos] = useState<ImagePickerAsset[]>([]);
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) return;

    async function loadBook() {
      try {
        setLoading(true);

        const book = await getBookById(Number(id));

        setTitle(book.title);
        setAuthor(book.author);
        setIsbn(book.isbn);
        setDescription(book.description);
        setStatus(book.status);
        setCondition(book.condition);
        setExistingPhotos(book.photos.map((photo: any) => photo.imageUrl));
      } catch (error) {
        console.log(error);

        Alert.alert("Erro", "Não foi possível carregar o livro.");
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  async function handleIsbnSearch() {
    if (!isbn.trim() || isbn.length < 10) {
      return;
    }

    try {
      const response = await findBookByIsbn(isbn);

      if (response.found) {
        setTitle(response.title ?? "");
        setAuthor(response.author ?? "");

        return;
      }

      Alert.alert(
        "ISBN não encontrado",
        "Preencha o título e o autor manualmente.",
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRegisterBook() {
    if (!title.trim() || !author.trim() || !description.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");

      return;
    }

    if (photos.length < 3) {
      Alert.alert(
        "Fotos insuficientes",
        "Adicione pelo menos 3 fotos do livro.",
      );

      return;
    }

    try {
      setLoading(true);

      const photoUrls: string[] = [];

      for (const photo of photos) {
        const url = await uploadBookPhoto(photo);
        photoUrls.push(url);
      }

      await registerBook({
        title,
        author,
        isbn,
        description,
        status,
        condition,
        photos: photoUrls,
      });

      Alert.alert("Sucesso", "Livro cadastrado com sucesso!");

      setTitle("");
      setAuthor("");
      setIsbn("");
      setDescription("");
      setPhotos([]);
    } catch (error: any) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível cadastrar o livro");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateBook() {
    if (
      !title.trim() ||
      !author.trim() ||
      !isbn.trim() ||
      !description.trim()
    ) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const newPhotoUrls: string[] = [];

      for (const photo of photos) {
        const url = await uploadBookPhoto(photo);
        newPhotoUrls.push(url);
      }

      await updateBook(Number(id), {
        title,
        author,
        isbn,
        description,
        status,
        condition,
        photos: [...existingPhotos, ...newPhotoUrls],
      });

      Alert.alert("Sucesso", "Livro atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace("/profile"),
        },
      ]);
    } catch (error: any) {
      console.log(error.response?.data);

      Alert.alert(
        "Erro",
        error.response?.data?.message ?? "Não foi possível atualizar o livro.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "É necessário permitir o acesso à galeria.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets]);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "É necessário permitir o acesso à câmera.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets]);
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return {
    title,
    setTitle,

    author,
    setAuthor,

    isbn,
    setIsbn,

    description,
    setDescription,

    loading,

    status,
    setStatus,

    photos,
    pickImages,
    removePhoto,
    takePhoto,

    isEditing,

    handleIsbnSearch,

    handleRegisterBook,
    handleUpdateBook,

    condition,
    setCondition,
  };
}
