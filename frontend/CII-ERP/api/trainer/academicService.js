import API from "../api";

export async function fetchAcademicDetails() {
  const res = await API.get("/instructor/academics-details");
  return res.data.data.details; // { education: {...}, experience: {...} }
}
