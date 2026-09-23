import { Router } from "express";
import { login } from "../../controllers/user-controllers/login";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { loginSchema } from "../../services/zod/users/user-login-schema";
import { logout } from "../../controllers/user-controllers/logout";




const userRouter = Router()

userRouter.post("/login", login)
userRouter.post("/logout",logout)

export default userRouter