import jwt from "jsonwebtoken";
import { ApiError } from "../../helpers/ApiError";

type accessTokenPayload = {
    mobilizer_id: string;
    mobilizer_first_name: string;
    mobilizer_last_name: string;

    user_id: string;
    center_id?: string;

    role: string;
    centre_name?: string;

    email?: string;
};

type refreshTokenPayload = {
    mobilizer_id: string;

    user_id: string;
    center_id?: string;

    role: string;

    mobilizer_first_name: string;
    mobilizer_last_name: string;
};

const generateMobilizerAccessToken = (token: accessTokenPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError(404, "token is not generated");
    }

    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });

    return generateToken;
};

const generateMobilizerRefreshToken = (token: refreshTokenPayload) => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError(404, "token is not generated");
    }

    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "20d",
    });

    return generateToken;
};

export {
    generateMobilizerAccessToken,
    generateMobilizerRefreshToken,
};