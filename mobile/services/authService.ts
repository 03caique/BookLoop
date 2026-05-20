import api from "./api";

import { User } from "../models/User";

export async function register(
  user: User
) {

  const response = await api.post(
    "/api/users",
    user
  );

  return response.data;
}

export async function login(
  user: User
) {

  const response = await api.post(
    "/api/auth/login",
    user
  );

  return response.data;
}