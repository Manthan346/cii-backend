import { CandidateProfile } from "../../types/candidate-types/candidate-type";



export const INSTRUCTOR_REDIS_KEYS = {
    mark_attendance_key: (id: string) => `markAttendace:${id}`,
    view_candidate_profile_key: (enrollmentId: string) => `viewCandidateProfile:${enrollmentId}`
    


    
}