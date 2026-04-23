import api from "./api";

export const getDisclaimerStatus = () =>
  api.get("/api/disclaimer/status").then((r) => r.data);

export const acceptDisclaimer = () =>
  api.post("/api/disclaimer/accept").then((r) => r.data);
