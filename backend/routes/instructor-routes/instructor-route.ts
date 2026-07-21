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
import { getAllCandidateBelongingToInstructor } from "../../src/controllers/instructor-controller/all-candidate-overview";
import { updateCandidateBatchStatus } from "../../src/controllers/instructor-controller/update-candidate-batch-status";
import { viewCandidateProfile } from "../../src/controllers/instructor-controller/view-candidate-profile";

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

instructorRouter.get(
    "/candidate-management/candidate-overview",
    verifyInstructorUsingAccessToken,
    getAllCandidateBelongingToInstructor
)

instructorRouter.patch(
    "/candidate-management/update-status",
    verifyInstructorUsingAccessToken,
    updateCandidateBatchStatus
)

instructorRouter.get(
    "/candidate-management/view-candidate-profile",
    verifyInstructorUsingAccessToken,
    viewCandidateProfile
)


export { instructorRouter };

