import API from "../api";

const REPORT_EXPORT_PATH = "/mobilizer/download-enquiry-excel";

export async function downloadMobilizerEnquiryReport(filters = {}) {
	const params = Object.fromEntries(
		Object.entries(filters).filter(([, value]) => value),
	);

	const response = await API.get(REPORT_EXPORT_PATH, {
		params,
		responseType: "blob",
	});

	const contentDisposition = response.headers["content-disposition"];
	const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
	const filename = filenameMatch?.[1] || "mobilizer_enquiries.xlsx";
	const url = URL.createObjectURL(response.data);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}
