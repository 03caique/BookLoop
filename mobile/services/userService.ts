import api from "./api";

export async function getUser(
  id: number
) {

  const response = await api.get(
    `/api/users/${id}`
  );

  return response.data;
}

export async function updateUser(
  id: number,
  data: {
    name: string;
    email: string;
  }
) {

  const response = await api.put(
    `/api/users/${id}`,
    data
  );

  return response.data;
}