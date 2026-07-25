import { Router } from "express";
import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../src/middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../src/controllers/instructor-controller/instructor-dashboard";
import { getBatchAttendance } from "../../src/controllers/instructor-controller/instructor-batch-attendance";
import { createCandidateByInstructor } from "../../src/controllers/instructor-controller/create-candidate-by-instructor";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import { createInstructorCandidateSchema } from "../../src/services/zod/instructor/create-Instructor-candidate-schema";
import { createInstructorCandidateEnrollmentSchema } from "../../src/services/zod/instructor/create-instructor-candidate-enrollment-schema";
import { enrollCandidate } from "../../src/controllers/instructor-controller/enroll-candidate";
import { getCandidateStatistics } from "../../src/controllers/instructor-controller/candidate-management-statistics";
import { getAllCandidateBelongingToInstructor } from "../../src/controllers/instructor-controller/all-candidate-overview";
import { updateCandidateBatchStatus } from "../../src/controllers/instructor-controller/update-candidate-batch-status";
import { viewCandidateProfile } from "../../src/controllers/instructor-controller/view-candidate-profile";
import { createStudyMaterial } from "../../src/controllers/instructor-controller/create-study-material";
import { createStudyMaterialSchema } from "../../src/services/zod/instructor/create-study-material-schema";
import { getStudyMaterial } from "../../src/controllers/instructor-controller/get-study-material";
import { updateStudyMaterialSchema } from "../../src/services/zod/instructor/update-study-material-schema";
import { updateStudyMaterial } from "../../src/controllers/instructor-controller/update-study-material";
import { createAssessment } from "../../src/controllers/instructor-controller/create-assessment";
import { createAssessmentSchema } from "../../src/services/zod/instructor/create-assessment-schema";
import { getAssessments } from "../../src/controllers/instructor-controller/get-assessment";
import { updateAssessmentSchema } from "../../src/services/zod/instructor/update-assessment-schema";
import { updateAssessment } from "../../src/controllers/instructor-controller/update-assessment"; 

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
instructorRouter.post(
    "/candidate-management/candidates",
    verifyInstructorUsingAccessToken,
    validateBody(createInstructorCandidateSchema),
    createCandidateByInstructor
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

instructorRouter.post("/study-material/create-material",verifyInstructorUsingAccessToken,validateBody(createStudyMaterialSchema),
createStudyMaterial)

instructorRouter.get("/study-material/get-all-material",verifyInstructorUsingAccessToken,getStudyMaterial)
instructorRouter.patch("/study-material/update-material",verifyInstructorUsingAccessToken,validateBody(updateStudyMaterialSchema),updateStudyMaterial)

instructorRouter.post("/assessment/create-assessment",verifyInstructorUsingAccessToken,validateBody(createAssessmentSchema),createAssessment)
instructorRouter.get("/assessment/get-assessment",verifyInstructorUsingAccessToken,getAssessments)
instructorRouter.patch("/assessment/update-assessment",verifyInstructorUsingAccessToken,validateBody(updateAssessmentSchema),updateAssessment)


export { instructorRouter };

