import api from "./api";

export const updateProfile = (data) =>
  api.put("/api/user/profile", data).then((r) => r.data);

export const changePassword = (data) =>
  api.put("/api/user/password", data).then((r) => r.data);
