import { Router } from "express";
// import { loginInstructor } from "../../src/controllers/instructor-controller/login-instructor";
import { verifyInstructorUsingAccessToken } from "../../middlewares/instructor-auth-middleware/instructor-auth-middleware";
import { getInstructorDashboard } from "../../controllers/instructor-controller/instructor-dashboard";
import { editInstructorProfileSchema } from "../../services/zod/instructor/instructor-edit-schema";
import { instructorEditProfile } from "../../controllers/instructor-controller/instructor-edit-profile";
import { instructorEditAddress } from "../../controllers/instructor-controller/instructor-edit-address";
import { editInstructorAddressSchema } from "../../services/zod/instructor/instructor-edit-address-schema";
import { instructorEditAcademic } from "../../controllers/instructor-controller/instructor-edit-academic";
import { editInstructorAcademicSchema } from "../../services/zod/instructor/instructor-edit-academic-schema";
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
import { createStudyMaterial } from "../../controllers/instructor-controller/create-study-material";
import { createStudyMaterialSchema } from "../../services/zod/instructor/create-study-material-schema";
import { getStudyMaterial } from "../../controllers/instructor-controller/get-study-material";
import { updateStudyMaterialSchema } from "../../services/zod/instructor/update-study-material-schema";
import { updateStudyMaterial } from "../../controllers/instructor-controller/update-study-material";
import { createAssessment } from "../../controllers/instructor-controller/create-assessment";
import { createAssessmentSchema } from "../../services/zod/instructor/create-assessment-schema";
import { getAssessments } from "../../controllers/instructor-controller/get-assessment";
import { updateAssessmentSchema } from "../../services/zod/instructor/update-assessment-schema";
import { updateAssessment } from "../../controllers/instructor-controller/update-assessment";
import { createCandidateByInstructor } from "../../controllers/instructor-controller/create-candidate-by-instructor";
import { createEventSchema } from "../../services/zod/event-schema/eventValidation";
import { updateEventSchema } from "../../services/zod/event-schema/eventValidation";
import { createInstructorEvent } from "../../controllers/instructor-controller/instructor-create-event";
import { updateInstructorEvent } from "../../controllers/instructor-controller/instructor-update-event";
import { getAllInstructorEvents } from "../../controllers/instructor-controller/get-instructor-events"; 
import { deleteInstructorEvent } from "../../controllers/instructor-controller/delete-instructor-event";
import { getAllAttendanceSessions } from "../../controllers/instructor-controller/instructor-get-allAttendanceSessions";
import { getSessionDetails } from "../../controllers/instructor-controller/instructor-get-attendanceSessionDetails";
import { instructorGuardianDetails } from "../../controllers/instructor-controller/instructor-guardian-details";
import { instructorEditGuardian } from "../../controllers/instructor-controller/instructor-edit-guardian";
import { editInstructorGuardianSchema } from "../../services/zod/instructor/instructor-edit-guardian-schema";
import { addCandidateAttendance } from "../../controllers/instructor-controller/mark-candidate-attendance";
import { getAllCoursesAndBatches } from "../../controllers/instructor-controller/get-allCoursesAndBatches";
import { uploadExcel } from "../../middlewares/multer-middleware/excel-upload-multer";
import { uploadSyllabus } from "../../controllers/instructor-controller/instructor-upload-batchSyllabus";
import { getBatchSyllabus } from "../../controllers/instructor-controller/instructor-get-batchSyllabus";
import { markBatchSyllabus } from "../../controllers/instructor-controller/mark-complete-batchSyllabus";
import { addBatchSyllabusTopic } from "../../controllers/instructor-controller/instructor-add-batchSyllabusTopic";
import { deleteBatchSyllabusTopic } from "../../controllers/instructor-controller/instructor-delete-batchSyllabusTopic";
import { addAttendanceBodySchema } from "../../services/zod/instructor/mark-attendance-schema";
import { getActiveStudentsForSession } from "../../controllers/instructor-controller/fetch-active-CandidatesForAttendance";
import { getInstructorNotifications } from "../../controllers/instructor-controller/fetch-all-instructorNotifications";

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
instructorRouter.post(
    "/candidate-management/candidates",
    verifyInstructorUsingAccessToken,
    validateBody(createInstructorCandidateSchema),
    createCandidateByInstructor
)
instructorRouter.patch(
    "/edit-profile",
    verifyInstructorUsingAccessToken,
    upload.single("profile_photo"),
    validateBody(editInstructorProfileSchema),
    instructorEditProfile
)
instructorRouter.patch(
    "/edit-address",
    verifyInstructorUsingAccessToken,
    validateBody(editInstructorAddressSchema),
    instructorEditAddress
)
instructorRouter.patch(
    "/edit-academic",
    verifyInstructorUsingAccessToken,
    validateBody(editInstructorAcademicSchema),
    instructorEditAcademic
)
instructorRouter.get("/basic-information", verifyInstructorUsingAccessToken,  instructorProfileDetails)
instructorRouter.get("/academics-details", verifyInstructorUsingAccessToken,  instructorAcademicDetails)
instructorRouter.post('/documents', upload.fields([
     {name: 'aadhar_card', maxCount: 1},
     {name: 'pan_card', maxCount: 1},
      {name: 'past_exp_letter', maxCount: 1},
       {name: 'instructor_resume', maxCount: 1}, 
        {name: 'highest_qualification_document', maxCount: 1}, 

]), multerErrorHandler,verifyInstructorUsingAccessToken, instructorDocuments)
instructorRouter.get("/contact-details", verifyInstructorUsingAccessToken, instructorContactDetails)
instructorRouter.get('/batches-card-data', verifyInstructorUsingAccessToken, instructorBatchCardData)
instructorRouter.get('/batches-details', verifyInstructorUsingAccessToken,validateQuery(instructorBatchesQuerySchema), paginationMiddleware, getInstructorBatches)
instructorRouter.get('/batch-details/:batchId',verifyInstructorUsingAccessToken, getBatchDetails )
instructorRouter.post('/create-batch', verifyInstructorUsingAccessToken, createBatch)
instructorRouter.patch('/batch-details/:batchId', verifyInstructorUsingAccessToken,validateBody(updateBatchSchema), editBatchDetails)
instructorRouter.post('/create-batch', verifyInstructorUsingAccessToken, validateBody(createBatchSchema), createBatch)
instructorRouter.patch(
    "/edit-guardian",
    verifyInstructorUsingAccessToken,
    validateBody(editInstructorGuardianSchema),
    instructorEditGuardian
)
instructorRouter.get('/guardian-details', verifyInstructorUsingAccessToken, instructorGuardianDetails)
instructorRouter.post('/mark-candidate-attendnace/:attendanceSessionId', verifyInstructorUsingAccessToken,validateBody(addAttendanceBodySchema), addCandidateAttendance)
instructorRouter.get('/get-all-courses-and-batches', verifyInstructorUsingAccessToken, getAllCoursesAndBatches)


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
instructorRouter.post("/instructor-events/create-event",verifyInstructorUsingAccessToken,validateBody(createEventSchema),createInstructorEvent)
instructorRouter.patch("/instructor-events/update-event/:event_id",verifyInstructorUsingAccessToken,validateBody(updateEventSchema),updateInstructorEvent)
instructorRouter.get("/instructor-events/get-event",verifyInstructorUsingAccessToken,paginationMiddleware,getAllInstructorEvents)
instructorRouter.delete("/instructor-events/delete-event/:event_id",verifyInstructorUsingAccessToken,deleteInstructorEvent)
instructorRouter.get("/attendance-management/get-sessions",verifyInstructorUsingAccessToken,paginationMiddleware,getAllAttendanceSessions);
instructorRouter.get("/attendance-management/get-sessions/:attendance_session_id",verifyInstructorUsingAccessToken,getSessionDetails)
instructorRouter.post("/batch-management/batch-syllabus/:batch_id/upload",verifyInstructorUsingAccessToken,uploadExcel.single("file"),uploadSyllabus
);
instructorRouter.get("/batch-management/batch-syllabus/:batch_id/get",verifyInstructorUsingAccessToken,getBatchSyllabus)
instructorRouter.patch("/batch-management/batch-syllabus/:batch_syllabus_id/",verifyInstructorUsingAccessToken,markBatchSyllabus)
instructorRouter.post("/batch-management/:batch_id/add_batch_syllabus",verifyInstructorUsingAccessToken,addBatchSyllabusTopic)
instructorRouter.delete("/batch-management/batch-syllabus/:batch_syllabus_id",
verifyInstructorUsingAccessToken,deleteBatchSyllabusTopic
)
//fetch all active students for marking attendance for particular session/lecture
instructorRouter.get("/attendance-sessions/:attendance_session_id/active-students",verifyInstructorUsingAccessToken,getActiveStudentsForSession
);
//fetch all instructor notifications
instructorRouter.get("/notifications",verifyInstructorUsingAccessToken,getInstructorNotifications);

export { instructorRouter };



