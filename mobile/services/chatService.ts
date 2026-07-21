import api from "./api";

export async function sendMessage(
  receiverId: number,
  content: string
) {
  const response = await api.post(
    "/api/messages",
    {
      receiverId,
      content,
    }
  );

  return response.data;
}

export async function getConversation(
  receiverId: number,
  page = 0
) {
  const response = await api.get(
    `/api/messages/${receiverId}`,
    {
      params: {
        page,
      },
    }
  );

  return response.data;
}

export async function getNewMessages(
  receiverId: number,
  after: string
) {
  const response = await api.get(
    `/api/messages/${receiverId}/new`,
    {
      params: {
        after,
      },
    }
  );

  return response.data;
}