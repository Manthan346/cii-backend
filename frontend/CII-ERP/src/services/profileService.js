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