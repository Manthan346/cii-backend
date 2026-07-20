import { Router } from "express";
import { createCandidate } from "../../src/controllers/candidate-controllers/create-candidate";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import {  createCandidateSchema } from "../../src/services/zod/candidate/candidate-schema";
import { getAllCandidate } from "../../src/controllers/candidate-controllers/get-all-candidate";
import { verifyCandidateUsingAccessToken } from "../../src/middlewares/candidate-auth-middleware/auth-middleware";
import candidateDashboardData from "../../src/controllers/candidate-controllers/candidate-dashboard-data";

import { candidateProfileDetails } from "../../src/controllers/candidate-controllers/candidate-profile";
import { candidateAcademicDetails } from "../../src/controllers/candidate-controllers/candidate-academic-details";
import { upload } from "../../src/middlewares/multer-middleware/multer";
import { candidateCertificateUpload } from "../../src/controllers/candidate-controllers/candidate-documents";
import { multerErrorHandler } from "../../src/middlewares/multer-middleware/file-limit-middleware";
import { candidateAttendanceCalendar } from "../../src/controllers/candidate-controllers/candidate-attendance";
import allCoursesAttendance from "../../src/controllers/candidate-controllers/candidate-allcourses-attendance";
import candidateAssessments from "../../src/controllers/candidate-controllers/candidate-assesments";
import candidateUpcomingSessions from "../../src/controllers/candidate-controllers/candidate-sessions";
import { candidateRoleMiddleware } from "../../src/middlewares/roles-middleware/candidate-role";
import { candidateRecentAttendanceLog } from "../../src/controllers/candidate-controllers/candidate-attendanceRecentLog";

const candidateRouter = Router()

candidateRouter.post('/create-candidate', validateBody(createCandidateSchema), createCandidate)
candidateRouter.get('/get-all-candidates', getAllCandidate)
candidateRouter.get('/dashboard-data',verifyCandidateUsingAccessToken,candidateRoleMiddleware,candidateDashboardData)

candidateRouter.get('/candidate-academics', verifyCandidateUsingAccessToken,candidateRoleMiddleware, candidateAcademicDetails)
candidateRouter.get('/candidate-profile', verifyCandidateUsingAccessToken,candidateRoleMiddleware,candidateProfileDetails)
candidateRouter.post('/candidate-documents', upload.fields([
    {name: 'aadhar_card', maxCount: 1},
     {name: 'pan_card', maxCount: 1},
      {name: 'passport_size_photo', maxCount: 1},
       {name: 'resume', maxCount: 1}, 

]),multerErrorHandler, verifyCandidateUsingAccessToken, candidateRoleMiddleware,candidateCertificateUpload)
candidateRouter.get('/candidate-attendance', verifyCandidateUsingAccessToken, candidateRoleMiddleware, candidateAttendanceCalendar)

candidateRouter.get('/candidate-allCourses-attendance', verifyCandidateUsingAccessToken,candidateRoleMiddleware, allCoursesAttendance)
candidateRouter.get('/candidate-assesment', verifyCandidateUsingAccessToken,candidateRoleMiddleware, candidateAssessments)
candidateRouter.get('/candidate-sessions', verifyCandidateUsingAccessToken, candidateRoleMiddleware, candidateUpcomingSessions)
candidateRouter.get('/candidate-attendance-recentLog', verifyCandidateUsingAccessToken, candidateRecentAttendanceLog)


export {
    candidateRouter
}