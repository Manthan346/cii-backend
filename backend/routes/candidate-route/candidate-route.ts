import { Router } from "express";
import { createCandidate } from "../../src/controllers/candidate-controllers/create-candidate";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import { candidateSchema } from "../../src/services/zod/candidate/candidate-schema";
import { getAllCandidate } from "../../src/controllers/candidate-controllers/get-all-candidate";

const candidateRouter = Router()

candidateRouter.post('/create-candidate', validateBody(candidateSchema), createCandidate)
candidateRouter.get('/get-all-candidates', getAllCandidate)


export {
    candidateRouter
}