import { Router } from "express";
import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../src/middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../src/controllers/instructor-controller/instructor-dashboard";

const instructorRouter = Router();

instructorRouter.post("/login", loginInstructor);
instructorRouter.get(
    "/instructor-dashboard",
    verifyInstructorUsingAccessToken,
    getInstructorDashboard
);

export { instructorRouter };