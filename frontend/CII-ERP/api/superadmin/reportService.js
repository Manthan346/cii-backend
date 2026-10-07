import API from "../api";
import { fetchEnrollmentTrend } from "./dashboardService";
import { fetchCenterDetails } from "./centreService";

export async function fetchEnrollmentReports(centerId = "all") {
	const [monthly, centres] = await Promise.all([
		fetchEnrollmentTrend(centerId),
		fetchCenterDetails(),
	]);

	return { monthly, centres };
}

export async function downloadEnrollmentReport({
	fromDate,
	toDate,
	centerId,
}) {
	try {
		const params = {
			from_date: fromDate,
			to_date: toDate,
		};
		if (centerId && centerId !== "all") params.center_id = centerId;

		const response = await API.get("/super-admin/reports/enrollment", {
			params,
			responseType: "blob",
		});
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
