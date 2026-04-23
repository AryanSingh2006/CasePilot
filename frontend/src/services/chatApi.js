import api from "./api";

export const askQuestion = (data) =>
  api.post("/api/chat/ask", data).then((r) => r.data);

export const getHistory = (page = 0, size = 20) =>
  api.get(`/api/chat/history?page=${page}&size=${size}`).then((r) => r.data);

export const getSession = (sessionId) =>
  api.get(`/api/chat/session/${sessionId}`).then((r) => r.data);

export const deleteQuery = (id) =>
  api.delete(`/api/chat/history/${id}`).then((r) => r.data);
