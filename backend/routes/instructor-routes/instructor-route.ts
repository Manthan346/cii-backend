import { Router } from "express";
import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../src/middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../src/controllers/instructor-controller/instructor-dashboard";
import { getBatchAttendance } from "../../src/controllers/instructor-controller/instructor-batch-attendance";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import { createInstructorCandidateSchema } from "../../src/services/zod/instructor/create-Instructor-candidate-schema";
import { createInstructorCandidateEnrollmentSchema } from "../../src/services/zod/instructor/create-instructor-candidate-enrollment-schema";
import { enrollCandidate } from "../../src/controllers/instructor-controller/enroll-candidate";
import { getCandidateStatistics } from "../../src/controllers/instructor-controller/candidate-management-statistics";

const instructorRouter = Router();

instructorRouter.post("/login", loginInstructor);
instructorRouter.get(
    "/instructor-dashboard",
    verifyInstructorUsingAccessToken,
    getInstructorDashboard
);
instructorRouter.get(
    "/batches/:batchId/attendance",
    verifyInstructorUsingAccessToken,
    getBatchAttendance
)

instructorRouter.get(
    "/test",
    (req,res)=>{
        res.send("Working");
    }
);
instructorRouter.post(
    "/candidate-management/enroll-candidate",
    verifyInstructorUsingAccessToken,
    validateBody(createInstructorCandidateEnrollmentSchema),
    enrollCandidate
)

instructorRouter.get(
    "/candidate-management/statistics",
    verifyInstructorUsingAccessToken,
    getCandidateStatistics
)


export { instructorRouter };

