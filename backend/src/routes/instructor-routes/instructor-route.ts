import { Router } from "express";
// import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../controllers/instructor-controller/instructor-dashboard";
import { getBatchAttendance } from "../../controllers/instructor-controller/instructor-batch-attendance";
import { createInstructorCandidateSchema } from "../../services/zod/instructor/create-Instructor-candidate-schema";
import { createInstructorCandidateEnrollmentSchema } from "../../services/zod/instructor/create-instructor-candidate-enrollment-schema";
import { enrollCandidate } from "../../controllers/instructor-controller/enroll-candidate";
import { getCandidateStatistics } from "../../controllers/instructor-controller/candidate-management-statistics";
import { getAllCandidateBelongingToInstructor } from "../../controllers/instructor-controller/all-candidate-overview";
import { updateCandidateBatchStatus } from "../../controllers/instructor-controller/update-candidate-batch-status";
import { viewCandidateProfile } from "../../controllers/instructor-controller/view-candidate-profile";
import { instructorProfileDetails } from "../../controllers/instructor-controller/instructor-profile";
import { instructorAcademicDetails } from "../../controllers/instructor-controller/instructor-academic-details";
import { upload } from "../../middlewares/multer-middleware/multer";
import { multerErrorHandler } from "../../middlewares/multer-middleware/file-limit-middleware";
import { instructorDocuments } from "../../controllers/instructor-controller/instructor-documents";
import { instructorContactDetails } from "../../controllers/instructor-controller/instructor-contactDetails";
import { instructorBatchCardData } from "../../controllers/instructor-controller/instructor-getBatchData";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { getInstructorBatches } from "../../controllers/instructor-controller/instructor-getAllBatchDetails";
import { validateQuery } from "../../middlewares/zod-middleware/zod-query-validator";
import { instructorBatchesQuerySchema } from "../../services/zod/instructor/batches-schema";
import { getBatchDetails } from "../../controllers/instructor-controller/instructor-get-batch";
import { editBatchDetails } from "../../controllers/instructor-controller/instructor-edit-batch";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { updateBatchSchema } from "../../services/zod/instructor/edit-batch-schema";
import { createBatch } from "../../controllers/instructor-controller/instructor-create-batch";
import { createBatchSchema } from "../../services/zod/instructor/create-batch-schema";
import { createAttendanceSessionsFromExcel } from "../../controllers/instructor-controller/instructor-create-session";
import { uploadExcel } from "../../middlewares/multer-middleware/excel-upload-multer";

const instructorRouter = Router();




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
instructorRouter.get("/basic-information", verifyInstructorUsingAccessToken,  instructorProfileDetails)
instructorRouter.get("/academics-details", verifyInstructorUsingAccessToken,  instructorAcademicDetails)
instructorRouter.post('/documents', upload.fields([
     {name: 'aadhar_card', maxCount: 1},
     {name: 'pan_card', maxCount: 1},
      {name: 'past_exp_letter', maxCount: 1},
       {name: 'instructor_resume', maxCount: 1}, 

]), multerErrorHandler,verifyInstructorUsingAccessToken, instructorDocuments)
instructorRouter.get("/contact-details", verifyInstructorUsingAccessToken, instructorContactDetails)
instructorRouter.get('/batches-card-data', verifyInstructorUsingAccessToken, instructorBatchCardData)
instructorRouter.get('/batches-details', verifyInstructorUsingAccessToken,validateQuery(instructorBatchesQuerySchema), paginationMiddleware, getInstructorBatches)
instructorRouter.get('/batch-details/:batchId',verifyInstructorUsingAccessToken, getBatchDetails )
instructorRouter.post('/create-batch', verifyInstructorUsingAccessToken, createBatch)
instructorRouter.patch('/batch-details/:batchId', verifyInstructorUsingAccessToken,validateBody(updateBatchSchema), editBatchDetails)
instructorRouter.post('/create-batch', verifyInstructorUsingAccessToken, validateBody(createBatchSchema), createBatch)
instructorRouter.post('/upload-session-sheet',uploadExcel.single("file"), multerErrorHandler, verifyInstructorUsingAccessToken, createAttendanceSessionsFromExcel)


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

