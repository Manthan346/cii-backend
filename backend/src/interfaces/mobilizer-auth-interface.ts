import { Request } from "express";

export interface MobilizerAuthRequest extends Request {
    mobilizer?: {
        mobilizer_id?: string;
        email?: string;
        center_id?:string
    };

    user: {
        user_id: string;
        role: string;
    };
}