import { Router } from "express";
import { getPublicEvents } from "../../controllers/event-controller/get-public-events";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { getPublicJobEvents } from "../../controllers/fetch-all-jobEvents";

const eventsRouter = Router();

// Public landing endpoint — no auth required
eventsRouter.get("/public", paginationMiddleware, getPublicEvents);
//Fetch all job fair/drive
eventsRouter.get('/job-events',paginationMiddleware,getPublicJobEvents);

// Public enquiry creation endpoint — no auth required (landing page form)


export default eventsRouter;
