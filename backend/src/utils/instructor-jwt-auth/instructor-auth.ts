import jwt from "jsonwebtoken"
import { ApiError } from '../../helpers/ApiError'

type InstructorAccessTokenPayload = {
    instructor_id: string,
    instructor_first_name: string,
    user_id: string,
    instructor_last_name: string,
    center_id?: string,
    centre_name?: string,
    email?: string,
    role: string
}


type InstructorRefreshTokenPayload = {
    instructor_id: string,
    center_id?: string,
    user_id: string,
    instructor_first_name: string,
    instructor_last_name: string,
    role: string
   
}


 const generateInstructorAccessToken = (token: InstructorAccessTokenPayload) => {
    if(!process.env.JWT_SECRET){
        throw new ApiError(404,"token is not generated")
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: "10m"
    })
    return generateToken

}


 const generateInstructorRefreshToken = (token: InstructorRefreshTokenPayload) => {
     if(!process.env.JWT_SECRET){
        throw new ApiError(404,"token is not generated")
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET,{
        expiresIn: "1d"
    })

    return generateToken


}

export {
    generateInstructorAccessToken,
    generateInstructorRefreshToken

}
