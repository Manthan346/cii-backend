import { Request } from "express";

export interface InstructorAuthRequest extends Request {

    instructor?: {
        
        instructor_id?: string,
        email?: string,
        
    },

    user: {
        user_id:string,
         role: string
    }

}