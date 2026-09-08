import API from "../api";

const REPORT_EXPORT_PATH = "/mobilizer/download-enquiry-excel";
const ENROLLMENT_ANALYTICS_PATH = "/mobilizer/enrollment/analytics";

function getMonthYear(value) {
	if (!value) return {};

	const [year, month] = value.split("-");
	return {
		month: Number(month),
		year: Number(year),
	};
}

export async function fetchEnrollmentAnalytics(filters = {}) {
	const from = getMonthYear(filters.from);
	const to = getMonthYear(filters.to);
	const params = Object.fromEntries(
		Object.entries({
			course_id: filters.courseId,
			from_month: from.month,
			from_year: from.year,
			to_month: to.month,
			to_year: to.year,
		}).filter(([, value]) => value !== undefined),
	);

	const response = await API.get(ENROLLMENT_ANALYTICS_PATH, { params });
	return response.data?.data ?? {};
}

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
