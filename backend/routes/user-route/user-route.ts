import { Router } from "express";
import { login } from "../../src/controllers/user-controllers/login";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import { loginSchema } from "../../src/services/zod/users/user-login-schema";




const userRouter = Router()

userRouter.post("/login", login)

export default userRouter