
//jwt token payload
export interface TokenPayload {
    candidate_id: string,
    candidate_first_name?: string,
    user_id: string,
    candidate_last_name?: string,
    center_id?: string
    
    centre_name?: string,
    
   
    email?: string

} 

export interface InstructorTokenPayload{
    // instructor-token-payload.ts
    instructor_id:string;
    user_id:string;

    instructor_first_name?:string;
    instructor_last_name?:string;

    center_id?:string;
    centre_name?:string;

    email?:string;
}