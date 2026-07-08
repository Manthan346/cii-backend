import { Router } from "express";
import { createCandidate } from "../../src/controllers/candidate-controllers/create-candidate";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import { candidateSchema } from "../../src/services/zod/candidate-schema";

const candidateRouter = Router()

candidateRouter.post('/create-candidate', validateBody(candidateSchema), createCandidate)

export {
    candidateRouter
}