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

  signIn: (token: string) => Promise<void>;

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
    newToken: string
  ) {

    await AsyncStorage.setItem(
      "token",
      newToken
    );

    setToken(newToken);
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