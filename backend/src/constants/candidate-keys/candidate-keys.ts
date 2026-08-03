import { CandidateProfile } from "../../types/candidate-types/candidate-type";



export const CANDIDATE_REDIS_KEYS = {
    candidate_profile_key: (id: string) =>  `profile:${id}`,
    candidate_guardian_key: (id: string) => `guardinDetails:${id}`,
    candidate_academic_key: (id: string) => `academicDetails:${id}` ,
    
     candidate_all_courses_attendance_key: (id: string) => `allCoursesAttendance:${id}`,
  candidate_attendance_calendar_key: (candidateId: string, courseId: string, month: number, year: number) =>
    `attendanceCalendar:${candidateId}:${courseId}:${month}:${year}`,
  candidate_recent_attendance_log_key: (id: string) => `recentAttendanceLog:${id}`,


    
}