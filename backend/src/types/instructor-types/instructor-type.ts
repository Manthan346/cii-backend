

type ParentDetails = {
  name: string | null;
  blood_group: string | null;
  occupation: string | null;
  phone_no: string | null;
  address: string | null;
  dob: Date | null;
  
};

type GuardianDetails = ParentDetails & {
  relationship: string | null;
 
  
};

export type InstructorGuardianDetails = {
  fatherDetails: ParentDetails;  // father
  motherDetails: ParentDetails;  // mother
  guardianDetails: GuardianDetails; // guardian (has extra fields: relationship, gender, dob)
};

type PersonalInformation = {
  name: string;
  gender: string | null
  dateOfBirth: Date | null;
  bloodGroup: string | null;
  highestQualification: string | null;
  profilePhoto?: string | null,
  designation: string | null
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
  currentAddress: string | null
};

type PermanentAddress = {
  permanenetCity: string | null;
  permanenetState: string | null;
  permanentTaluka: string | null;
  permanentDistrict: string | null;
  permanentPincode: string | null,
  permanentAddress: string | null
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