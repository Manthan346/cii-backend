import { Router } from "express";
// import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../src/middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../src/controllers/instructor-controller/instructor-dashboard";
import { getBatchAttendance } from "../../src/controllers/instructor-controller/instructor-batch-attendance";
import { instructorProfileDetails } from "../../src/controllers/instructor-controller/instructor-profile";
import { instructorAcademicDetails } from "../../src/controllers/instructor-controller/instructor-academic-details";
import { upload } from "../../src/middlewares/multer-middleware/multer";
import { multerErrorHandler } from "../../src/middlewares/multer-middleware/file-limit-middleware";
import { instructorDocuments } from "../../src/controllers/instructor-controller/instructor-documents";
import { instructorContactDetails } from "../../src/controllers/instructor-controller/instructor-contactDetails";
import { instructorBatchCardData } from "../../src/controllers/instructor-controller/instructor-getbatchData";
import { paginationMiddleware } from "../../src/middlewares/pagination-middleware/pagination";
import { getInstructorBatches } from "../../src/controllers/instructor-controller/instructor-getAllBatchDetails";
import { validateQuery } from "../../src/middlewares/zod-middleware/zod-query-validator";
import { instructorBatchesQuerySchema } from "../../src/services/zod/instructor/batches-schema";
import { getBatchDetails } from "../../src/controllers/instructor-controller/instructor-get-batch";
import { editBatchDetails } from "../../src/controllers/instructor-controller/instructor-edit-batch";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-body-validator";
import { updateBatchSchema } from "../../src/services/zod/instructor/edit-batch-schema";
import { createBatch } from "../../src/controllers/instructor-controller/instructor-create-batch";
import { createBatchSchema } from "../../src/services/zod/instructor/create-batch-schema";

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

export { instructorRouter };