import jwt from "jsonwebtoken";
import { ApiError } from "../../helpers/ApiError";

type HrAccessTokenPayload = {
    hr_id: string;
    hr_first_name: string;
    hr_last_name: string;

    user_id: string;
    company_id: string;

    role: string;
    email?: string;
};

type HrRefreshTokenPayload = {
    hr_id: string;

    user_id: string;
    company_id: string;

    role: string;

    hr_first_name: string;
    hr_last_name: string;
};

const generateHrAccessToken = (token: HrAccessTokenPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError(404, "token is not generated");
    }

    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });

    return generateToken;
};

const generateHrRefreshToken = (token: HrRefreshTokenPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError(404, "token is not generated");
    }

    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return generateToken;
};

export {
    generateHrAccessToken,
    generateHrRefreshToken,
};