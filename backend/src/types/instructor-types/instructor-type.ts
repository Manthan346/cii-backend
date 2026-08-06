// types/instructor-profile.type.ts

type PersonalInformation = {
  name: string;
  gender: string | null;
  dateOfBirth: Date | null;
  bloodGroup: string | null;
  highestQualification: string | null;
};

type ContactDetails = {
  mobileNumber: string;
  emergencyContact: string | null;
  email: string | undefined;
};

type CurrentAddress = {
  currentState: string | null;
  currentDistrict: string | null;
  currentTaluka: string | null;
  currentCity: string | null;
  currentPincode: string | null;
};

type PermanentAddress = {
  permanenetCity: string | null;
  permanenetState: string | null;
  permanentTaluka: string | null;
  permanentDistrict: string | null;
  permanentPincode: string | null
};

export type InstructorBasicInformation = {
  personalInformation: PersonalInformation;
  contactDetails: ContactDetails;
  currentAddress: CurrentAddress;
  permanentAddress: PermanentAddress;
};

export type InstructorProfileResponse = {
  profileCompletion: number;
  basicInformation: InstructorBasicInformation;
};