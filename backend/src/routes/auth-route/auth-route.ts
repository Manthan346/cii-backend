import { Router } from "express";
import { generateNewAccessTokenRefreshToken } from "../../controllers/auth-controllers/new-accessToken";



const authRouter = Router()



authRouter.post('/refresh', generateNewAccessTokenRefreshToken)

export default authRouter