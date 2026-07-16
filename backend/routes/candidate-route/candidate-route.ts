import { Router } from "express";
import { createCandidate } from "../../src/controllers/candidate-controllers/create-candidate";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import {  createCandidateSchema } from "../../src/services/zod/candidate/candidate-schema";
import { getAllCandidate } from "../../src/controllers/candidate-controllers/get-all-candidate";
import { verifyCandidateUsingAccessToken } from "../../src/middlewares/candidate-auth-middleware/auth-middleware";
import candidateDashboardData from "../../src/controllers/candidate-controllers/candidate-dashboard-data";
import { loginCandidate } from "../../src/controllers/candidate-controllers/login-candidate";

const candidateRouter = Router()

candidateRouter.post('/create-candidate', validateBody(createCandidateSchema), createCandidate)
candidateRouter.get('/get-all-candidates', getAllCandidate)
candidateRouter.post('/dashboard-data',verifyCandidateUsingAccessToken,candidateDashboardData)
candidateRouter.post('/login', loginCandidate)
/*candidateRouter.get(
    "/attendance/upcoming-sessions",verifyCandidateUsingAccessToken,getUpcomingSessions);*/

export {
    candidateRouter
}