import { Redirect }
from "expo-router";

import { useAuth }
from "../contexts/AuthContext";

export default function Index() {

  const {
    authenticated,
    loading,
  } = useAuth();

  if (loading) {
    return null;
  }

  if (authenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/welcome" />;
}