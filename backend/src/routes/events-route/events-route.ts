import { Router } from "express";
import { getPublicEvents } from "../../controllers/event-controller/get-public-events";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";

const eventsRouter = Router();

// Public landing endpoint — no auth required
eventsRouter.get("/public", paginationMiddleware, getPublicEvents);

// Public enquiry creation endpoint — no auth required (landing page form)


export default eventsRouter;
