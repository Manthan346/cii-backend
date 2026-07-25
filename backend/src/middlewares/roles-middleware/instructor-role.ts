// import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface"
// import { Response, NextFunction } from "express"
// import { ApiError } from "../../helpers/ApiError"
// import { asyncHandler } from "../../helpers/asyncHandler"


//---------------------------- role are already verfied in auth middleware ------------------------------------------------



// export const instructorRoleMiddleware = asyncHandler(async(req: InstructorAuthRequest, res: Response, next: NextFunction) => {

//         const instructorRole =  req.instructor!.role
//         if (instructorRole !== "instructor") {
//             throw new ApiError(403, "you are not a instructor")
            
//         }

//         next()
// })
