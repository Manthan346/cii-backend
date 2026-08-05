import { Router } from "express";
import { createCandidate } from "../../controllers/candidate-controllers/create-candidate";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createCandidateSchema } from "../../services/zod/candidate/candidate-schema";
import { getAllCandidate } from "../../controllers/candidate-controllers/get-all-candidate";
import { verifyCandidateUsingAccessToken } from "../../middlewares/candidate-auth-middleware/auth-middleware";
import candidateDashboardData from "../../controllers/candidate-controllers/candidate-dashboard-data";

import { candidateProfileDetails } from "../../controllers/candidate-controllers/candidate-profile";
import { candidateAcademicDetails } from "../../controllers/candidate-controllers/candidate-academic-details";
import { upload } from "../../middlewares/multer-middleware/multer";
import { candidateCertificateUpload } from "../../controllers/candidate-controllers/candidate-documents";
import { multerErrorHandler } from "../../middlewares/multer-middleware/file-limit-middleware";
import { candidateAttendanceCalendar } from "../../controllers/candidate-controllers/candidate-attendance";
import allCoursesAttendance from "../../controllers/candidate-controllers/candidate-allcourses-attendance";
import candidateAssessments from "../../controllers/candidate-controllers/candidate-assesments";
import candidateUpcomingSessions from "../../controllers/candidate-controllers/candidate-sessions";
// import { candidateRoleMiddleware } from "../../src/middlewares/roles-middleware/candidate-role";
import { candidateRecentAttendanceLog } from "../../controllers/candidate-controllers/candidate-attendanceRecentLog";
import { getCandidateNotifications } from "../../controllers/candidate-controllers/candidate-getAllNotification";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { getAllCandidateStudyMaterial } from "../../controllers/candidate-controllers/candidate-get-all-study-material";
import { getAllAssessments } from "../../controllers/candidate-controllers/candidate-get-available-assessments";
import { startAssessment } from "../../controllers/candidate-controllers/candidate-assessment-mark-attempt";
import { getAllCandidateEvents } from "../../controllers/candidate-controllers/candidate-events";
import { candidateGuardianDetails } from "../../controllers/candidate-controllers/candidate-guardian-details";

const candidateRouter = Router()

candidateRouter.post('/create-candidate', validateBody(createCandidateSchema), createCandidate)
candidateRouter.get('/get-all-candidates', getAllCandidate)
candidateRouter.get('/dashboard-data',verifyCandidateUsingAccessToken,candidateDashboardData)

candidateRouter.get('/candidate-academics', verifyCandidateUsingAccessToken, candidateAcademicDetails)
candidateRouter.get('/candidate-profile', verifyCandidateUsingAccessToken,candidateProfileDetails)
candidateRouter.post('/candidate-documents', upload.fields([
    {name: 'aadhar_card', maxCount: 1},
     {name: 'pan_card', maxCount: 1},
      {name: 'passport_size_photo', maxCount: 1},
       {name: 'resume', maxCount: 1}, 

]),multerErrorHandler, verifyCandidateUsingAccessToken, candidateCertificateUpload)
candidateRouter.get('/candidate-attendance', verifyCandidateUsingAccessToken, candidateAttendanceCalendar)

candidateRouter.get('/candidate-allCourses-attendance', verifyCandidateUsingAccessToken, allCoursesAttendance)
candidateRouter.get('/candidate-assesment', verifyCandidateUsingAccessToken, candidateAssessments)
candidateRouter.get('/candidate-sessions', verifyCandidateUsingAccessToken, candidateUpcomingSessions)
candidateRouter.get('/get-all-notifications', verifyCandidateUsingAccessToken, getCandidateNotifications)

candidateRouter.get('/candidate-attendance-recentLog', verifyCandidateUsingAccessToken, candidateRecentAttendanceLog)
candidateRouter.get("/test", (req, res) => {
    res.send("Candidate router works");
});
candidateRouter.get('/guardian-details', verifyCandidateUsingAccessToken, candidateGuardianDetails)
candidateRouter.get('/candidate-studymaterial',verifyCandidateUsingAccessToken,paginationMiddleware,getAllCandidateStudyMaterial)
candidateRouter.get('/candidate-assessment/get-all-assessments',verifyCandidateUsingAccessToken,paginationMiddleware,getAllAssessments)
candidateRouter.post('/candidate-assessment/mark-attempt/:assessment_id',verifyCandidateUsingAccessToken,startAssessment)
candidateRouter.get('/events/get-event', verifyCandidateUsingAccessToken,paginationMiddleware,getAllCandidateEvents)

export {
    candidateRouter
}