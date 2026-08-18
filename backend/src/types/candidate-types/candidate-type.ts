export type CandidateProfile = {
  candidate_first_name: string;
  candidate_last_name: string | null;
  contact_number: string;
  gender: string | null;
  category: string | null;
  email: string;
  date_of_birth: Date | null;
  blood_group: string | null;
  candidate_current_address: string | null;
  candidate_permanent_address: string | null;
  current_city: string | null;
  current_district: string | null;
  current_pin_code: string | null;
  current_state_name: string | null;
  permanent_city: string | null;
  permanent_district: string | null;
  permanent_pin_code: string | null;
  permanent_state_name: string | null;
  candidate_code: string | null;

  
 
};


type ParentDetails = {
  name: string | null;
  blood_group: string | null;
  occupation: string | null;
  phone_no: string | null;
  address: string | null;
};

type GuardianDetails = ParentDetails & {
  relationship: string | null;
  gender: string | null;
  dob: Date | null;
};

export type CandidateGuardianDetails = {
  fatherDetails: ParentDetails;  // father
  motherDetails: ParentDetails;  // mother
  guardianDetails: GuardianDetails; // guardian (has extra fields: relationship, gender, dob)
};


// types/candidate-academic.type.ts

type CourseAcademicDetail = {
  title: string;
  course: string;
  company: string;
  mode: string | null;
  course_type: string | null;
  location: string | null;
  enrolled_date: Date;
  starting_date: Date;
  end_date: Date;
  trainer_name: string | null;
  supervisor_name: string | null;
  description: string | null;
};

export type CandidateAcademicDetails = {
  candidate_id: string;
  candidate_name: string;
  center_name: string | null;
  courses: CourseAcademicDetail[];
};