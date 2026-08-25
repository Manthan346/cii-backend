import { Request } from "express";

export interface InstructorAuthRequest extends Request {

    instructor?: {

        instructor_id?: string,
        email?: string,
        company_id?:string

    },

    user: {
        user_id:string,
         role: string,
         center_id: string,
         is_active: boolean
    }

}