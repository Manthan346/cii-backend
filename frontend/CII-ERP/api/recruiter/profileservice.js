import API from "../api";

const toShortName = (organization = "") => {
  const initials = organization
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || organization;
};

/** Fetches the profile for the authenticated HR/recruiter user. */
export async function fetchRecruiterProfile() {
  const response = await API.get("/hr/profile");
  const profile = response.data?.data ?? {};
  const organization = profile.organization_name ?? "";

  return {
    name: profile.name ?? "",
    designation: profile.designation ?? "",
    organization,
    organizationShort: toShortName(organization),
    email: profile.organization_email ?? "",
    phone: profile.phone_no ?? "",
  };
}

// Splits a single "First Last" input into the hr_first_name / hr_last_name
// pair the backend expects. A single-word name maps to first name only,
// with last name sent as null (the API explicitly allows null to mean
// "no last name" — see hr-profile-edit-api docs).
function splitName(fullName = "") {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: null };
  const [first, ...rest] = trimmed.split(/\s+/);
  return { firstName: first, lastName: rest.length ? rest.join(" ") : null };
}

/**
 * -> updateRecruiterProfile (PATCH /hr/profile)
 * Only hr_first_name, hr_last_name, hr_phone_no are editable per the
 * backend. `name` here is the single combined field this page's form
 * uses - it's split into first/last before sending.
 *
 * Returns whatever the backend sends back: { name, designation, phone_no }
 * - notably NOT organization/email, so the caller must merge this into
 * existing profile state rather than replace it outright.
 */
export async function updateRecruiterProfile({ name, phone }) {
  const { firstName, lastName } = splitName(name);

  const payload = {
    hr_first_name: firstName,
    hr_last_name: lastName,
    hr_phone_no: phone,
  };

  try {
    const response = await API.patch("/hr/profile/update", payload);
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
