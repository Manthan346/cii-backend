import API from "../api";
import { fetchCenters } from "./centreService";

function toMonthYear(monthValue) {
	if (!monthValue) return "";
	const value = String(monthValue).trim();
	if (/^\d{2}\/\d{4}$/.test(value)) return value;
	const [year, month] = value.split("-");
	if (!year || !month) return "";
	return `${month}/${year}`;
}

function normalizeMonthlyEnrollment(payload = {}) {
	const centers = Array.isArray(payload.centers) ? payload.centers : [];
	const monthly = {};

	centers.forEach((center) => {
		(center.monthly_enrollment ?? []).forEach((entry) => {
			const year = Number(entry.year);
			const month = Number(entry.month);
			const key = `${year}-${String(month).padStart(2, "0")}`;
			monthly[key] =
				(monthly[key] ?? 0) + Number(entry.enrollment_count ?? 0);
		});
	});

	return monthly;
}

export async function fetchEnrollmentReports({
	centerId = "all",
	fromMonth,
	toMonth,
} = {}) {
	const params = {};
	const fromValue = toMonthYear(fromMonth);
	const toValue = toMonthYear(toMonth);

	if (fromValue) params.from = fromValue;
	if (toValue) params.to = toValue;
	if (centerId && centerId !== "all") params.center_id = centerId;

	const [response, centres] = await Promise.all([
		API.get("/super-admin/reports/enrollment/monthly", { params }),
		fetchCenters(),
	]);
	const payload = response?.data?.data ?? {};
	const monthly = normalizeMonthlyEnrollment(payload);
	return { monthly, centres, period: payload.period ?? null };
}

export async function downloadEnrollmentReport({
	fromMonth,
	toMonth,
	centerId,
}) {
	try {
		const params = {
			from: toMonthYear(fromMonth),
			to: toMonthYear(toMonth),
		};
		if (centerId && centerId !== "all") params.center_id = centerId;

		const response = await API.get(
			"/super-admin/reports/enrollment/course-wise",
			{
				params,
				responseType: "blob",
			},
		);
		const disposition = response.headers?.["content-disposition"];
		const filename =
			disposition?.match(/filename="?([^"]+)"?/)?.[1] ??
			"enrollment-report.xlsx";
		const url = window.URL.createObjectURL(response.data);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
	} catch (error) {
		const data = error?.response?.data;
		let message = data?.message || error?.message;
		if (data instanceof Blob) {
			try {
				const parsed = JSON.parse(await data.text());
				message = parsed?.message || parsed?.error || message;
			} catch {
				// Keep the original request error when the response isn't JSON.
			}
		}
		throw new Error(message || "Unable to download enrollment report.", {
			cause: error,
		});
	}
}
