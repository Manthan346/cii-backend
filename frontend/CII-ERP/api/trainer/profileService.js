import API from "../api";

function normalizeInstructorProfilePayload(payload) {
  const response = payload?.response ?? payload ?? {};
  const basicInformation =
    response?.basicInformation ?? payload?.basicInformation ?? {};

  return {
    profileCompletion:
      payload?.profileCompletion ?? response?.profileCompletion ?? 0,
    basicInformation,
  };
}

export async function fetchInstructorProfile() {
  const res = await API.get("/instructor/basic-information");
  const payload = res?.data?.data ?? res?.data ?? {};
  return normalizeInstructorProfilePayload(payload);
}

function formatDateForApi(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export async function updateInstructorProfile({ personal, contact, photo }) {
  const formData = new FormData();
  const fields = {
    first_name: personal?.firstName,
    last_name: personal?.lastName,
    gender: personal?.gender,
    date_of_birth: formatDateForApi(personal?.dob),
    blood_group: personal?.bloodGroup,
    highest_qualification: personal?.highestQualification,
    designation: personal?.designation,
    contact_number: contact?.mobileNumber,
    emergency_contact: contact?.emergencyContactNumber,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  if (photo) formData.append("profile_photo", photo);

  const res = await API.patch("/instructor/edit-profile", formData);
  return res?.data?.data?.profile ?? res?.data?.profile ?? {};
}
