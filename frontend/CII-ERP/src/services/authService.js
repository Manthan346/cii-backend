import API from "../../api/api";

export async function logoutUser() {
  try {
    await API.post("/user/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("userSession");
  }
}
