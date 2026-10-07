export const MOBILIZER_REDIS_KEYS = {
  dashboard_stats: (centerId: string) => `mob:stats:${centerId}`,
  dashboard_charts: (centerId: string) => `mob:charts:${centerId}`,
  enquiry_stats: (centerId: string) => `mob:enquiry-stats:${centerId}`,

  enrollment_analytics: (centerId: string, filters: {
    courseId?: string;
    fromMonth: number; fromYear: number;
    toMonth: number; toYear: number;
  }) => {
    const hash = JSON.stringify(filters);
    return `mob:enroll-analytics:${centerId}:${hash}`;
  },

  all_enquiries: (centerId: string, filters: {
    page: number; limit: number;
    search?: string; status?: string; source?: string; date?: string;
  }) => {
    const hash = JSON.stringify(filters);
    return `mob:enquiries:${centerId}:${hash}`;
  },

  candidates: (centerId: string, filters: { page: number; limit: number }) => {
    const hash = JSON.stringify(filters);
    return `mob:candidates:${centerId}:${hash}`;
  },
};