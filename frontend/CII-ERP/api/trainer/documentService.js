import api from "../api";

// Maps profileDocuments' doc.id values to the multipart field names
// multer/instructor-documents.ts actually expect on the wire.
// The backend payload exposes the highest qualification document as
// "instructor_highest_qualification_documents" in the current response
// contract, so the UI must map to that exact field rather than an older
// singular alias used in comments.
export const DOCUMENT_FIELD_MAP = {
  'doc-1': 'highest_qualification_document', // Highest Qualification Document
  'doc-2': 'past_exp_letter',                 // Past Experience letter
  'doc-3': 'pan_card',                        // PAN Card
  'doc-4': 'aadhar_card',                     // Aadhar Card
  'doc-5': 'instructor_resume',               // Resume
};

/**
 * Fetches the currently uploaded instructor documents on page load.
 * This endpoint is a GET/read-only lookup for the current profile's
 * document records. The backend upsert POST can create-or-update the
 * same fields, so the UI only reads once during component mount.
 */
export async function fetchInstructorDocuments() {
  const res = await api.post("/instructor/documents");
  const payload = res?.data?.data ?? res?.data ?? {};
  const rawData = payload?.documents ?? payload?.data ?? payload ?? {};

  return rawData;
}

/**
 * Uploads one or more instructor documents. Pass only the fields you
 * have a file for — the backend upserts, treating missing fields as
 * "leave unchanged".
 *
 * @param {Object} fieldsToFiles - e.g. { aadhar_card: File }
 * @returns {Promise<{status: string, message: string, uploaded: Object}>}
 */
export async function uploadInstructorDocuments(fieldsToFiles) {
  const formData = new FormData();
  Object.entries(fieldsToFiles).forEach(([field, file]) => {
    if (file) formData.append(field, file);
  });

  const res = await api.post("/instructor/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}