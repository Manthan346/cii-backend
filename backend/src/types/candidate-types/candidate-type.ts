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
  state_name: string | null;
  district: string | null;
  pin_code: number | null;
};