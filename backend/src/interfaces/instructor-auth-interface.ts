import { Request } from "express";

export interface InstructorAuthRequest extends Request {

    instructor?: {
        
        instructor_id?: string,
        email?: string,
        role:"instructor"
    },

    user: {
        user_id:string,
        center_id:string
    }

}