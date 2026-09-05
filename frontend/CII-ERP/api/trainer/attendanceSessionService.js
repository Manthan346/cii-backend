import api from "../api";

export async function uploadAttendanceSessions(file) {
  if (!file) throw new Error("Please select an Excel file.");

  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/instructor/create-session/excel", formData);
  return response.data?.data;
}
