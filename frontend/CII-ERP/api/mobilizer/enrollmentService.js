import API from "../api.js";

export async function fetchEnrollmentCourses() {
	const response = await API.get("/mobilizer/courses/simple");
	const courses = response.data?.data?.courses;

	if (!Array.isArray(courses)) {
		throw new Error("Courses response has an invalid format");
	}

	return courses;
}

export async function fetchEnrollmentBatches(courseId) {
	const response = await API.get("/mobilizer/batches", {
		params: { courseId },
	});
	const batches = response.data?.data?.batches;

	if (!Array.isArray(batches)) {
		throw new Error("Batches response has an invalid format");
	}

	return batches;
}

export async function enrollCandidate(candidate) {
	const response = await API.post("/mobilizer/enroll-candidate", candidate);
	return response.data;
}
