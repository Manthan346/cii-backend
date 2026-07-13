import { Request } from "express";

// extending interface types for verifying user data for new access,refresh token generation
export interface CandidateAuthRequest extends Request {
    candidate?: {
<<<<<<< HEAD
        candidate_id: string,
=======
        candidate_id?: string,
>>>>>>> 8c4af90 (add login controller, candidate dashboard data enrolled courses, total sessions, pending assesment)
        email?: string,
        
        
    },
    user: {
        user_id: string
    }
}