import api from "../api";

const CANDIDATES_PATH = "/mobilizer/candidates";

export async function fetchMobilizerCandidates({ page = 1, limit = 20 } = {}) {
  const response = await api.get(CANDIDATES_PATH, {
    params: { page, limit },
  });

  return response.data.data;
}

export async function fetchAllMobilizerCandidates() {
  const response = await api.get(CANDIDATES_PATH, {
    params: { page: 1, limit: 100 },
  });

  return response.data.data?.candidates || [];
}

export async function fetchMobilizerCandidateDetails(candidateId) {
  const response = await api.get(`${CANDIDATES_PATH}/${candidateId}`);
  return response.data.data;
}
