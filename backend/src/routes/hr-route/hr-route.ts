import { Router } from "express";
import { verifyHrUsingAccessToken } from "../../middlewares/hr-auth-middleware/hr-auth-middleware";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createJobEventSchema } from "../../services/zod/event-schema/job-event-schema";
import { createJobEvent } from "../../controllers/hr-controllers/create-job-event";
import { getAllHrJobEvents } from "../../controllers/hr-controllers/get-all-hrJobEvents";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { updateJobEventStatus } from "../../controllers/hr-controllers/update-jobFair-Status";
import { getHrProfile } from "../../controllers/hr-controllers/get-hr-profile";
import { updateJobEventSchema } from "../../services/zod/event-schema/job-event-schema";
import { updateJobEvent } from "../../controllers/hr-controllers/update-job-event";
import { checkJobEventDate } from "../../controllers/hr-controllers/check-event-dateConflict";

const hrRouter = Router();

hrRouter.post("/job-event/add",verifyHrUsingAccessToken,validateBody(createJobEventSchema),createJobEvent);
//to check whether there are more than 2 job fairs/drive happening on same day 
hrRouter.get("/job-event/check-date",verifyHrUsingAccessToken,checkJobEventDate)
hrRouter.get("/job-event",verifyHrUsingAccessToken,paginationMiddleware,getAllHrJobEvents)
//change the status of job fair/drive to completed/upcoming/cancelled
hrRouter.patch("/job-event/:job_event_id/status",verifyHrUsingAccessToken,
updateJobEventStatus);
//fetch hr profile
hrRouter.get("/profile",verifyHrUsingAccessToken,getHrProfile);
//update Job fair details
hrRouter.patch('/job-event/update/:job_event_id',verifyHrUsingAccessToken,validateBody(updateJobEventSchema),updateJobEvent)

export default hrRouter;