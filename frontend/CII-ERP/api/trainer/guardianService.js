import api from "../api";

export async function fetchGuardianDetails() {
  const res = await api.get("/instructor/guardian-details");
  return res.data.data.guardianDetails; // { father: {...}, mother: {...}, guardian: {...} }
}