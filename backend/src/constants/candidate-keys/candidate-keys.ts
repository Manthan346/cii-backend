import { CandidateProfile } from "../../types/candidate-types/candidate-type";



export const CANDIDATE_REDIS_KEYS = {
    candidate_profile_key: (id: string) =>  `profile:${id}`


    
}