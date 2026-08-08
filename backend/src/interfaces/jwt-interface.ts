
//jwt token payload for candidate
export interface TokenPayload {
    candidate_id: string,
    candidate_first_name?: string,
    user_id: string,
    candidate_last_name?: string,
    center_id?: string
    role: string
    centre_name?: string,
    
   
    email?: string
} 


//jwt token payload for instructor
export interface InstructorTokenPayload{
    instructor_id:string,
    instructor_first_name?:string,
    user_id:string,
    role: string,
    instructor_last_name?:string,
    center_id:string,
    center_name?:string,
    company_id?: string,
    email?:string
}

export interface MobilizerTokenPayload {
    mobilizer_id: string;
    mobilizer_first_name?: string;
    mobilizer_last_name?: string;
    user_id: string;
    role: string;
    center_id: string;
    center_name?: string;
    email?: string;
}