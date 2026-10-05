import {
	fetchCenterWiseEnrollment,
	fetchEnrollmentTrend,
} from "./dashboardService";

export async function fetchEnrollmentReports() {
	const [monthly, byCenter] = await Promise.all([
		fetchEnrollmentTrend(),
		fetchCenterWiseEnrollment(),
	]);

	return { monthly, byCenter };
}
