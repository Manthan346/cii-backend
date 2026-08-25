import { Request } from "express";

// extending interface types for verifying user data for new access,refresh token generation
export interface adminAuthRequest extends Request {

    user: {
        user_id: string,
         role: string,
         email: string,
         center_id: string,
         is_active: boolean
    }
}