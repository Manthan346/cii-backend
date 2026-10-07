export const HR_REDIS_KEYS = {
    hr_profile_key: (id:string)=> `hr:profile:${id}`,
    hr_dashboard_key:()=> `hr:dashboard`,
    hr_application_graph_data:()=> `hr:application_graph_data`,
    hr_pie_chart:()=>`hr:pie_chart`,
    job_postings: (
        page: number,
        limit: number,
        search: unknown,
        sector: unknown,
        company_name: unknown,
        job_role: unknown,
        work_mode: unknown,
        location: unknown
    ) =>
        `hr:job-postings:${JSON.stringify({
            page,
            limit,
            search: search ?? "",
            sector: sector ?? "",
            company_name: company_name ?? "",
            job_role: job_role ?? "",
            work_mode: work_mode ?? "",
            location: location ?? "",
        })}`,
}