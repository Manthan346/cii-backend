import jwt from "jsonwebtoken"
import { ApiError } from '../../helpers/ApiError'

type adminAccessTokenPayload = {
    

    user_id: string,
    center_id?: string
    role: string,
    centre_name?: string,
    
   
    email: string
}


type adminRefreshTokenPayload = {

    center_id?: string,
    user_id: string,
    role: string,
    centre_name?: string

 
   
}


 const generateAdminAccessToken = (token: adminAccessTokenPayload) => {
    if(!process.env.JWT_SECRET){
        throw new ApiError(404,"token is not generated")
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "10m"
    })
    return generateToken

}


 const generateAdminRefreshToken = (token: adminRefreshTokenPayload) => {
     if(!process.env.JWT_SECRET){
        throw new ApiError(404,"token is not generated")
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET,{
        expiresIn: "1d"
    })

    return generateToken


}

export {
    generateAdminAccessToken,
    generateAdminRefreshToken

}
