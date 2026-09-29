import jwt from "jsonwebtoken";
import { ApiError } from "../../helpers/ApiError";

type SuperAdminAccessTokenPayload = {
    super_admin_id: string;
    first_name: string;
    last_name: string;

    user_id: string;

    role: string;
    email?: string;
};

type SuperAdminRefreshTokenPayload = {
    super_admin_id: string;
    user_id: string;
    role: string;
    first_name: string;
    last_name: string;
};

const generateSuperAdminAccessToken = (token: SuperAdminAccessTokenPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError(404, "token is not generated");
    }

    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });

    return generateToken;
};

const generateSuperAdminRefreshToken = (token: SuperAdminRefreshTokenPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError(404, "token is not generated");
    }

    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "20d",
    });

    return generateToken;
};

export {
    generateSuperAdminAccessToken,
    generateSuperAdminRefreshToken,
};