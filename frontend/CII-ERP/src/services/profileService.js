// profileService.js
import API from "../../api/api";

export function fetchCandidateProfile() {
  return API.get("candidate/candidate-profile");
}

export function fetchCandidateAcademics() {
  return API.get("candidate/candidate-academics");
}

export function fetchCandidateDocuments() {
  return API.post("candidate/candidate-documents", {});
}

export function fetchCandidateGuardianDetails() {
  return API.get("candidate/guardian-details");
}

function omitBlankValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  );
}

export function updateCandidateProfile(personalInfo, profilePhoto) {
  const fields = omitBlankValues({
    first_name: personalInfo.first_name ?? personalInfo.candidate_first_name,
    last_name: personalInfo.last_name ?? personalInfo.candidate_last_name,
    gender: personalInfo.gender,
    date_of_birth: personalInfo.date_of_birth,
    blood_group: personalInfo.blood_group,
    emergency_contact_no: personalInfo.emergency_contact_no,
    contact_number: personalInfo.contact_number,
    highest_qualification: personalInfo.highest_qualification,
    qualification_percentage: personalInfo.qualification_percentage,
    pancard_no: personalInfo.pancard_no,
    aadhar_card: personalInfo.aadhar_card,
    profile_photo: personalInfo.profile_photo ?? personalInfo.avatar_url,
  });

  if (!profilePhoto) {
    return API.patch("candidate/candidate-profile", fields);
  }

  const formData = new FormData();
  const profileFields = { ...fields };
  delete profileFields.profile_photo;
  Object.entries(profileFields).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  formData.append("profile_photo", profilePhoto);

  return API.patch("candidate/candidate-profile", formData);
}

export function updateCandidateAddress(addressInfo) {
  const payload = omitBlankValues({
    candidate_current_address: addressInfo.candidate_current_address,
    candidate_permanent_address: addressInfo.candidate_permanent_address,
    current_city: addressInfo.current_city || addressInfo.district,
    current_district: addressInfo.current_district,
    current_pin_code: addressInfo.current_pin_code || addressInfo.pin_code,
    current_state_name:
      addressInfo.current_state_name || addressInfo.state_name,
    permanent_city: addressInfo.permanent_city || addressInfo.district,
    permanent_district: addressInfo.permanent_district,
    permanent_pin_code: addressInfo.permanent_pin_code || addressInfo.pin_code,
    permanent_state_name:
      addressInfo.permanent_state_name || addressInfo.state_name,
  });

  return API.patch("candidate/candidate-address", payload);
}

export function updateCandidateGuardianDetails(guardianDetails) {
  const guardian = guardianDetails?.guardianDetails;
  const father = guardianDetails?.fatherDetails;
  const mother = guardianDetails?.motherDetails;

  const payload = omitBlankValues({
    guardian_name: guardian?.name,
    guardian_relationship: guardian?.relationship,
    guardian_blood_group: guardian?.blood_group,
    guardian_phone_no: guardian?.phone_no,
    guardian_occupation: guardian?.occupation,
    guardian_address: guardian?.address,
    guardian_gender: guardian?.gender,
    guardian_dob: guardian?.dob,
    father_name: father?.name,
    father_occupation: father?.occupation,
    father_phone_no: father?.phone_no,
    father_blood_group: father?.blood_group,
    father_address: father?.address,
    mother_name: mother?.name,
    mother_occupation: mother?.occupation,
    mother_phone_no: mother?.phone_no,
    mother_blood_group: mother?.blood_group,
    mother_address: mother?.address,
  });

  return API.patch("candidate/guardian-profile", payload);
}
