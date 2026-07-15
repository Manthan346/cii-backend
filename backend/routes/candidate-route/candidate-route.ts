import { Router } from "express";
import { createCandidate } from "../../src/controllers/candidate-controllers/create-candidate";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import {  createCandidateSchema } from "../../src/services/zod/candidate/candidate-schema";
import { getAllCandidate } from "../../src/controllers/candidate-controllers/get-all-candidate";
import { verifyCandidateUsingAccessToken } from "../../src/middlewares/candidate-auth-middleware/auth-middleware";
import candidateDashboardData from "../../src/controllers/candidate-controllers/candidate-dashboard-data";
import { loginCandidate } from "../../src/controllers/candidate-controllers/login-candidate";
import { candidateProfileDetails } from "../../src/controllers/candidate-controllers/candidate-profile";
import { candidateAcademicDetails } from "../../src/controllers/candidate-controllers/candidate-academic-details";
import { upload } from "../../src/middlewares/multer-middleware/multer";
import { candidateCertificateUpload } from "../../src/controllers/candidate-controllers/candidate-documents";
import { multerErrorHandler } from "../../src/middlewares/multer-middleware/file-limit-middleware";
import { candidateAttendanceSummary } from "../../src/controllers/candidate-controllers/candidate-attendance";
import allCoursesAttendance from "../../src/controllers/candidate-controllers/candidate-allcourses-attendance";

const candidateRouter = Router()

candidateRouter.post('/create-candidate', validateBody(createCandidateSchema), createCandidate)
candidateRouter.get('/get-all-candidates', getAllCandidate)
candidateRouter.post('/dashboard-data',verifyCandidateUsingAccessToken,candidateDashboardData)
candidateRouter.post('/login', loginCandidate)
candidateRouter.get('/candidate-academics', verifyCandidateUsingAccessToken, candidateAcademicDetails)
candidateRouter.get('/candidate-profile', verifyCandidateUsingAccessToken,candidateProfileDetails)
candidateRouter.post('/candidate-documents', upload.fields([
    {name: 'aadhar_card', maxCount: 1},
     {name: 'pan_card', maxCount: 1},
      {name: 'passport_size_photo', maxCount: 1},
       {name: 'resume', maxCount: 1}, 

]),multerErrorHandler, verifyCandidateUsingAccessToken, candidateCertificateUpload)
candidateRouter.get('/candidate-attendance', verifyCandidateUsingAccessToken, candidateAttendanceSummary)
candidateRouter.get('/candidate-allCourses-attendance', verifyCandidateUsingAccessToken, allCoursesAttendance)

export {
    candidateRouter
}