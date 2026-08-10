import { Request } from "express";

export interface HrAuthRequest extends Request {
    hr?: {
        hr_id?: string;
        email?: string;
        company_id?: string;
    };

    user: {
        user_id: string;
        role: string;
    };
}