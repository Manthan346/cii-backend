import jwt from "jsonwebtoken"
import { ApiError } from '../../helpers/ApiError'

type accessTokenPayload = {
    candidate_id: number,
    candidate_first_name: string,
    candidate_last_name: string,

    centre_name: string,
    
   
    email: string
}


type refreshTokenPayload = {
    candidate_id: number,
    candidate_first_name: string,
    candidate_last_name: string
   
}



 const generateAccessToken = (token: accessTokenPayload) => {
    if(!process.env.JWT_SECRET){
        throw new ApiError(404,"token is not generated")
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "10m"
    })
    return generateToken

}


 const generateRefreshToken = (token: refreshTokenPayload) => {
     if(!process.env.JWT_SECRET){
        throw new ApiError(404,"token is not generated")
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET,{
        expiresIn: "1d"
    })

    return generateToken


}

export {
    generateAccessToken,
    generateRefreshToken

}
