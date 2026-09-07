import API from "../../api/api";

function formatIssuedDate(value) {
	if (!value) return "Issued date unavailable";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Issued date unavailable";
	return new Intl.DateTimeFormat("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}

function normalizeCertificate(certificate) {
	const batch = certificate.batch_details;
	const title = batch?.course_details?.course_name || "Certificate";

	return {
		id: certificate.enrollment_id,
		title,
		subtitle: `Batch ${batch?.batch_code || "-"}`,
		grade: "Certified",
		certificateUrl: certificate.certificate_url,
		issuedDate: formatIssuedDate(certificate.issued_at),
	};
}

export async function fetchCandidateCertificates() {
	const response = await API.get("/candidate/certificates");
	const certificates = response.data?.data;

	if (!Array.isArray(certificates)) {
		throw new Error("Certificates response has an invalid format");
	}

	return certificates.map(normalizeCertificate);
}

export default fetchCandidateCertificates;
