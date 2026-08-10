import { Request } from "express";

export interface MobilizerAuthRequest extends Request {
    mobilizer?: {
        mobilizer_id?: string;
        email?: string;
    };

    user: {
        user_id: string;
        role: string;
    };
}