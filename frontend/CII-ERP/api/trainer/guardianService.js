import api from "../api";

export async function fetchGuardianDetails() {
  const res = await api.get("/instructor/guardian-details");
  return res.data.data.details; // { father: {...}, mother: {...}, guardian: {...} }
}