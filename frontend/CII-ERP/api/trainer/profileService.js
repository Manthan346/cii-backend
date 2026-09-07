import API from "../api";

function normalizeInstructorProfilePayload(payload) {
  const response = payload?.response ?? payload ?? {};
  const basicInformation =
    response?.basicInformation ?? payload?.basicInformation ?? {};
  const personalInformation = basicInformation?.personalInformation ?? {};
  const currentAddress = basicInformation?.currentAddress ?? {};
  const permanentAddress = basicInformation?.permanentAddress ?? {};
  const instructorId =
    response?.instructor_id ??
    payload?.instructor_id ??
    basicInformation?.instructor_id ??
    personalInformation?.instructor_id ??
    personalInformation?.instructorId ??
    null;
  const profilePhoto =
    response?.profile_photo ??
    response?.profilePhoto ??
    payload?.profile_photo ??
    payload?.profilePhoto ??
    personalInformation?.profile_photo ??
    personalInformation?.profilePhoto ??
    null;

  return {
    profileCompletion:
      payload?.profileCompletion ?? response?.profileCompletion ?? 0,
    instructorId,
    profilePhoto,
    basicInformation: {
      ...basicInformation,
      personalInformation: {
        ...personalInformation,
        designation:
          personalInformation.designation ??
          personalInformation.instructor_designation ??
          personalInformation.instructorDesignation ??
          "",
      },
      currentAddress: {
        ...currentAddress,
        line: currentAddress.line ?? currentAddress.currentAddress ?? "",
        state: currentAddress.state ?? currentAddress.currentState ?? "",
        city: currentAddress.city ?? currentAddress.currentCity ?? "",
        district:
          currentAddress.district ?? currentAddress.currentDistrict ?? "",
        taluka: currentAddress.taluka ?? currentAddress.currentTaluka ?? "",
        pinCode: currentAddress.pinCode ?? currentAddress.currentPincode ?? "",
      },
      permanentAddress: {
        ...permanentAddress,
        line: permanentAddress.line ?? permanentAddress.permanentAddress ?? "",
        state: permanentAddress.state ?? permanentAddress.permanenetState ?? "",
        city: permanentAddress.city ?? permanentAddress.permanenetCity ?? "",
        district:
          permanentAddress.district ?? permanentAddress.permanentDistrict ?? "",
        taluka:
          permanentAddress.taluka ?? permanentAddress.permanentTaluka ?? "",
        pinCode:
          permanentAddress.pinCode ?? permanentAddress.permanentPincode ?? "",
      },
    },
  };
}

export async function fetchInstructorProfile() {
  const res = await API.get("/instructor/basic-information");
  const payload = res?.data?.data ?? res?.data ?? {};
  return normalizeInstructorProfilePayload(payload);
}
