import API from "../api";

export async function fetchcompanycourses() {
    const response = await API.get("/admin/company-courses");

    return (
        response?.data?.data ?? {
            total_companies: 0,
            total_courses: 0,
            companies: [],
            courses: [],
        }
    );
}

export async function createAdminCompany(payload) {
    const response = await API.post("/admin/create-company", payload);
    return response?.data;
}

export async function createAdminCourse(payload) {
    const response = await API.post("/admin/create-course", payload);
    return response?.data;
}