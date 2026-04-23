import api from "./api";

export const getCategories = () =>
  api.get("/api/categories").then((r) => r.data);
