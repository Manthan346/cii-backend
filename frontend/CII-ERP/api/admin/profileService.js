import API from "../api";

/**
 * -> fetchAdminProfile (GET /admin/profile)
 * ⚠️ CONFIRM THIS PATH matches your route file registering getAdminProfile.
 * Returns: { admin_first_name, admin_last_name, date_of_birth, blood_group, email, phone_no }
 */
export async function fetchAdminProfile() {
  try {
    const response = await API.get("/admin/profile");
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to load profile.",
      { cause: error },
    );
  }
}

/**
 * -> updateAdminProfile (PATCH /admin/profile/edit)
 * Accepts a subset of: { admin_first_name, admin_last_name, blood_group,
 * admin_phone_no, date_of_birth }. Only defined fields are sent — undefined
 * ones are dropped so we never accidentally overwrite a field with undefined.
 *
 * `form.phone_no` (the shape used by the GET response / this page's local
 * state) is translated to `admin_phone_no` here, since that's the field
 * name this controller's Zod schema actually expects.
 *
 * Returns the same shape as fetchAdminProfile: { admin_first_name,
 * admin_last_name, date_of_birth, blood_group, email, phone_no }.
 */
export async function updateAdminProfile(form) {
  const payload = {};

  if (form.admin_first_name !== undefined)
    payload.admin_first_name = form.admin_first_name;
  if (form.admin_last_name !== undefined)
    payload.admin_last_name = form.admin_last_name;
  if (form.blood_group !== undefined) payload.blood_group = form.blood_group;
  if (form.date_of_birth !== undefined)
    payload.date_of_birth = form.date_of_birth;
  if (form.phone_no !== undefined) payload.admin_phone_no = form.phone_no;

  try {
    const response = await API.patch("/admin/profile/edit", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile.",
      { cause: error },
    );
  }
}
