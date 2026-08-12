import { Router } from "express";
import { verifyHrUsingAccessToken } from "../../middlewares/hr-auth-middleware/hr-auth-middleware";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createJobEventSchema } from "../../services/zod/event-schema/job-event-schema";
import { createJobEvent } from "../../controllers/hr-controllers/create-job-event";

const hrRouter = Router();

hrRouter.post("/job-event/add",verifyHrUsingAccessToken,validateBody(createJobEventSchema),createJobEvent);

export default hrRouter;