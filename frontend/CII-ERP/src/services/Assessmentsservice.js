// ============================================================================
// assessmentsService.js
// ----------------------------------------------------------------------------
// All assessment-related API calls for the candidate assessments page.
//
// IMPORTANT: adjust the import path below to match where this file actually
// lives relative to your existing `api/api.js`. Route paths below are taken
// directly from candidate-router.ts.
// ============================================================================

import API from "../../api/api";

// Existing endpoint — returns { pending, completed, pendingCount, completedCount }
export const fetchCandidateAssessments = () => {
  return API.get("/candidate/candidate-assesment");
};

// GET /candidate/candidate-assessment/get-all-assessments
// This route uses `paginationMiddleware`, so it almost certainly expects
// page/limit query params and returns pagination metadata alongside the
// list. Param names and response field names below are a best guess based
// on common conventions in this codebase (e.g. `data.pending`,
// `data.pendingCount` elsewhere) — confirm against the actual
// `getAllAssessments` controller and adjust if the field names differ.
export const fetchAvailableAssessments = (page = 1, limit = 10) => {
  return API.get("/candidate/candidate-assessment/get-all-assessments", {
    params: { page, limit },
  });
};

// POST /candidate/candidate-assessment/mark-attempt/:assessment_id
export const startAssessment = (assessmentId) => {
  return API.post(`/candidate/candidate-assessment/mark-attempt/${assessmentId}`);
};