import API from "../api.js";

export async function getEnquiryCenters() {
  const response = await API.get("/enquiry/centers");
  return response.data?.data?.centers ?? [];
}

export async function getCoursesByCenter(centerId) {
  const response = await API.post("/enquiry/courses-by-center", {
    center_id: centerId,
  });
  return response.data?.data?.courses ?? [];
}

export async function submitEnquiry(payload = {}) {
  const requestBody = {
    enquiry_first_name: payload.enquiry_first_name ?? payload.firstName ?? "",
    enquiry_last_name: payload.enquiry_last_name ?? payload.lastName ?? "",
    enquiry_email: payload.enquiry_email ?? payload.email ?? "",
    enquiry_phone_no: payload.enquiry_phone_no ?? payload.mobile ?? "",
    enquiry_education: payload.enquiry_education ?? payload.education ?? "",
    enquiry_location: payload.enquiry_location ?? payload.location ?? "",
    center_id: payload.center_id ?? payload.centerId ?? null,
    course_id: payload.course_id ?? payload.courseId ?? null,
    enquiry_source: payload.enquiry_source ?? payload.enquirySource ?? "Website",
    remarks: payload.remarks ?? "Interested in full-time courses",
    course_type: payload.course_type ?? payload.courseType ?? "Full-time",
    query: payload.query ?? `Enquiry for ${payload.course ?? "course"}`.trim(),
    ...payload,
  };

  const response = await API.post("/enquiry/create-enquiry", requestBody);
  return response.data?.data ?? response.data;
}

export default submitEnquiry;
