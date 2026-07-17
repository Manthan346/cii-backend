import { Router } from "express";
import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";

const instructorRouter = Router();

instructorRouter.post("/login", loginInstructor);

export { instructorRouter };