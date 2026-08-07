import API from "../api";

function normalizeInstructorProfilePayload(payload) {
  const response = payload?.response ?? payload ?? {};
  const basicInformation = response?.basicInformation ?? payload?.basicInformation ?? {};

  return {
    profileCompletion: payload?.profileCompletion ?? response?.profileCompletion ?? 0,
    basicInformation,
  };
}

export async function fetchInstructorProfile() {
  const res = await API.get("/instructor/basic-information");
  const payload = res?.data?.data ?? res?.data ?? {};
  return normalizeInstructorProfilePayload(payload);
}
