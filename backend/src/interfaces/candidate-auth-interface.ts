import { Request } from "express";

// extending interface types for verifying user data for new access,refresh token generation
export interface CandidateAuthRequest extends Request {
    candidate?: {
        
        candidate_id?: string,
        email?: string,
        
        
    },
    user: {
        user_id: string
    }
}