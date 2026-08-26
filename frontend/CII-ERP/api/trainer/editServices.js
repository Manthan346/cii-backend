import API from "../api";

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

function mapAddressForApi(address = {}, prefix) {
  return {
    [`${prefix}_city`]: address.city ?? address[`${prefix}City`],
    [`${prefix}_state`]: address.state ?? address[`${prefix}State`],
    [`${prefix}_district`]: address.district ?? address[`${prefix}District`],
    [`${prefix}_taluka`]: address.taluka ?? address[`${prefix}Taluka`],
    [`${prefix}_pincode`]: address.pinCode ?? address[`${prefix}Pincode`],
    [`${prefix}_address`]: address.line ?? address[`${prefix}Address`],
  };
}

export async function updateInstructorAddress({
  currentAddress,
  permanentAddress,
}) {
  const fields = {
    ...mapAddressForApi(currentAddress, "current"),
    ...mapAddressForApi(permanentAddress, "permanent"),
  };
  const payload = Object.fromEntries(
    Object.entries(fields).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );

  const res = await API.patch("/instructor/edit-address", payload);
  return res?.data?.data?.profile ?? res?.data?.profile ?? {};
}

function addIfDefined(target, key, value) {
  if (value !== undefined && value !== null && value !== "") {
    target[key] = value;
  }
}

export async function updateInstructorGuardian({
  fatherDetails = {},
  motherDetails = {},
  guardianDetails = {},
}) {
  const payload = {};
  const fields = [
    ["guardian_name", guardianDetails.name],
    ["guardian_relationship", guardianDetails.relationship],
    ["guardian_occupation", guardianDetails.occupation],
    ["guardian_phone_no", guardianDetails.phone_no],
    ["guardian_address", guardianDetails.address],
    ["guardian_blood_group", guardianDetails.blood_group],
    ["guardian_dob", formatDateForApi(guardianDetails.dob)],
    ["father_name", fatherDetails.name],
    ["father_occupation", fatherDetails.occupation],
    ["father_phone_no", fatherDetails.phone_no],
    ["father_blood_group", fatherDetails.blood_group],
    ["father_address", fatherDetails.address],
    ["father_dob", formatDateForApi(fatherDetails.dob)],
    ["mother_name", motherDetails.name],
    ["mother_occupation", motherDetails.occupation],
    ["mother_phone_no", motherDetails.phone_no],
    ["mother_blood_group", motherDetails.blood_group],
    ["mother_address", motherDetails.address],
    ["mother_dob", formatDateForApi(motherDetails.dob)],
  ];

  fields.forEach(([key, value]) => addIfDefined(payload, key, value));

  const res = await API.patch("/instructor/edit-guardian", payload);
  return res?.data?.data?.guardianDetails ?? res?.data?.guardianDetails ?? {};
}

export async function updateInstructorAcademic({
  education = {},
  experience = {},
}) {
  const payload = {
    highest_qualification: education.highestEducation,
    specialization: education.specialization,
    university: education.university,
    passing_year: education.passingYear,
    additional_qualifications: education.additionalQualification,
    total_experience:
      experience.totalExperience === undefined ||
      experience.totalExperience === null
        ? experience.totalExperience
        : String(experience.totalExperience),
    previous_organization: experience.previousOrganization,
    role: experience.role,
  };

  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const res = await API.patch("/instructor/edit-academic", filteredPayload);
  return res?.data?.data?.academics ?? res?.data?.academics ?? {};
}
