export const HR_REDIS_KEYS = {
    hr_profile_key: (id:string)=> `hr:profile:${id}`,
    hr_dashboard_key:()=> `hr:dashboard`,
    hr_application_graph_data:()=> `hr:application_graph_data`
}