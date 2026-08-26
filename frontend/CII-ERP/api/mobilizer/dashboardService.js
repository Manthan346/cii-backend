import API from "../api.js";

const STAT_CARD_CONFIG = {
	"Total Leads": { id: "total-leads", icon: "Calendar", tone: "blue" },
	Interested: { id: "interested", icon: "FileText", tone: "green" },
	"Not Connected": { id: "not-connected", icon: "PhoneMissed", tone: "cyan" },
	"Not Connected Leads": { id: "not-connected", icon: "PhoneMissed", tone: "cyan" },
	Connected: { id: "connected", icon: "Link2", tone: "magenta" },
	"Connected Leads": { id: "connected", icon: "Link2", tone: "magenta" },
	"Follow Up Pending": { id: "followup-pending", icon: "Share2", tone: "purple" },
	"Counseling Done": { id: "counseling-done", icon: "MonitorCheck", tone: "teal" },
	"Document Pending": { id: "doc-pending", icon: "IdCard", tone: "purple" },
	"Document Verification": { id: "doc-verification", icon: "FileCheck2", tone: "magenta" },
	"Batch Assigned/Admission": { id: "batch-assigned", icon: "Layers", tone: "blue" },
	"Batch Assigned/ Admission": { id: "batch-assigned", icon: "Layers", tone: "blue" },
};

export async function fetchDashboardStats() {
	const response = await API.get("/mobilizer/dashboard-stats");
	const payload = response.data?.data;
	const stats = Array.isArray(payload) ? payload : payload?.stats;

	if (!Array.isArray(stats)) {
		throw new Error("Dashboard stats response has an invalid format");
	}

	return stats.map(({ status, label, count }) => {
		const statLabel = status ?? label;

		return {
		id: STAT_CARD_CONFIG[statLabel]?.id ?? statLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
		icon: STAT_CARD_CONFIG[statLabel]?.icon ?? "Circle",
		tone: STAT_CARD_CONFIG[statLabel]?.tone ?? "blue",
		label: statLabel,
		value: count,
		};
	});
}

export async function fetchDashboardCharts() {
	const response = await API.get("/mobilizer/dashboard-charts");
	const charts = response.data?.data;

	if (
		!charts ||
		!Array.isArray(charts.weekly_enrollment) ||
		!Array.isArray(charts.candidate_distribution) ||
		!Array.isArray(charts.weekly_calls)
	) {
		throw new Error("Dashboard charts response has an invalid format");
	}

	return {
		weeklyEnrollment: charts.weekly_enrollment.map(({ day, count }) => ({
			label: day,
			value: count,
		})),
		candidateDistribution: charts.candidate_distribution.map(({ status, count }) => ({
			label: formatStatusLabel(status),
			value: count,
			tone: STATUS_TONES[String(status).toUpperCase()] ?? "gray",
		})),
		weeklyCalls: charts.weekly_calls.map(({ day, count }) => ({
			label: day,
			value: count,
		})),
	};
}

const STATUS_TONES = {
	CALL_RECIEVED: "navy",
	CENTER_VISITED: "blue",
	CENTER_NOT_VISITED: "gray",
	ENROLLED: "green",
	WRONG_NUMBER: "red",
	CALL_BUSY: "orange",
	CALL_DROPPED_OUT: "red",
	DOCUMENT_VERIFICATION_PENDING: "amber",
	INTERESTED: "green",
	DOCUMENT_VERIFICATION_DONE: "green",
	NOT_CONNECTED: "cyan",
	CONNECTED: "blue",
	COUNSELING_DONE: "teal",
	FOLLOW_UP_PENDING: "purple",
	NOT_INTERESTED: "red",
};

function formatStatusLabel(status) {
	const normalizedStatus = String(status).toUpperCase();
	const labels = {
		CALL_RECIEVED: "Call Received",
		CENTER_VISITED: "Center Visited",
		CENTER_NOT_VISITED: "Center Not Visited",
		ENROLLED: "Enrolled",
		WRONG_NUMBER: "Wrong Number",
		CALL_BUSY: "Call Busy",
		CALL_DROPPED_OUT: "Call Dropped Out",
		DOCUMENT_VERIFICATION_PENDING: "Document Verification Pending",
		INTERESTED: "Interested",
		DOCUMENT_VERIFICATION_DONE: "Document Verification Done",
		NOT_CONNECTED: "Not Connected",
		CONNECTED: "Connected",
		COUNSELING_DONE: "Counseling Done",
		FOLLOW_UP_PENDING: "Follow Up Pending",
		NOT_INTERESTED: "Not Interested",
	};

	return labels[normalizedStatus] ?? normalizedStatus.split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
}
