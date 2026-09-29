import { Request } from "express";

export interface SuperAdminAuthRequest extends Request {
    superadmin?: {
        super_admin_id?: string;
        first_name?:string,
        last_name?:string
    };

    user: {
        user_id: string;
        role: string;
        email:string
    };
}