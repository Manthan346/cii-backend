import { Router } from "express";
// import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../src/middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../src/controllers/instructor-controller/instructor-dashboard";
import { getBatchAttendance } from "../../src/controllers/instructor-controller/instructor-batch-attendance";
import { intructorProfileDetails } from "../../src/controllers/instructor-controller/instructor-profile";
import { instructorAcademicDetails } from "../../src/controllers/instructor-controller/instructor-academic-details";
import { upload } from "../../src/middlewares/multer-middleware/multer";
import { multerErrorHandler } from "../../src/middlewares/multer-middleware/file-limit-middleware";
import { instructorDocuments } from "../../src/controllers/instructor-controller/instructor-documents";
import { instructorContactDetails } from "../../src/controllers/instructor-controller/instructor-contactDetails";

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
instructorRouter.get("/basic-information", verifyInstructorUsingAccessToken,  intructorProfileDetails)
instructorRouter.get("/academics-details", verifyInstructorUsingAccessToken,  instructorAcademicDetails)
instructorRouter.post('/documents', upload.fields([
     {name: 'aadhar_card', maxCount: 1},
     {name: 'pan_card', maxCount: 1},
      {name: 'past_exp_letter', maxCount: 1},
       {name: 'instructor_resume', maxCount: 1}, 

]), multerErrorHandler,verifyInstructorUsingAccessToken, instructorDocuments)
instructorRouter.get("/contact-details", verifyInstructorUsingAccessToken, instructorContactDetails)

export { instructorRouter };