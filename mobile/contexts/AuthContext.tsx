import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextData = {

  authenticated: boolean;

  loading: boolean;

  token: string | null;

  userId: number | null;

  name: string;

  email: string;

  signIn: (
    token: string,
    userId: number,
    name: string,
    email: string
  ) => Promise<void>;

  signOut: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  );

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {

  const [token, setToken] =
    useState<string | null>(null);

  const [userId, setUserId] =
    useState<number | null>(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadToken();

  }, []);

  async function loadToken() {

    try {

      const storedToken =
        await AsyncStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  async function signIn(
    newToken: string,
    newUserId: number,
    newName: string,
    newEmail: string
  ) {

    await AsyncStorage.setItem(
      "token",
      newToken
    );

    await AsyncStorage.setItem(
      "userId",
      String(newUserId)
    );

    await AsyncStorage.setItem(
      "name",
      newName
    );

    await AsyncStorage.setItem(
      "email",
      newEmail
    );

    setToken(newToken);
    setUserId(newUserId);
    setName(newName);
    setEmail(newEmail);
  }

  async function signOut() {

    await AsyncStorage.removeItem(
      "token"
    );

    setToken(null);
  }

  return (

    <AuthContext.Provider
      value={{
        authenticated: !!token,

        loading,

        token,

        userId,

        name,

        email,

        signIn,

        signOut,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}