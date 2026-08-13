import { Router} from 'express';
import { verifyMobilizerUsingAccessToken } from '../../middlewares/mobilizer-auth-middleware/mobilizer-auth-middleware';
import { getAllEnquiry } from '../../controllers/mobilizer-controller/get-all-enquiry';
import { paginationMiddleware } from '../../middlewares/pagination-middleware/pagination';
import { getAllJobEvents } from '../../controllers/mobilizer-controller/get-all-jobEvents';
import { validateBody } from '../../middlewares/zod-middleware/zod-body-validator';
import { getMobilizerProfile } from '../../controllers/mobilizer-controller/get-profile';

const mobilizerRouter = Router();

mobilizerRouter.get(
    "/enquiry-management",
    verifyMobilizerUsingAccessToken,
    paginationMiddleware,
    getAllEnquiry
);
mobilizerRouter.get("/job-event",verifyMobilizerUsingAccessToken,paginationMiddleware,getAllJobEvents)

// Fetch all job fair and job drive for the mobilizer
mobilizerRouter.get("/job-fair",verifyMobilizerUsingAccessToken,paginationMiddleware,getAllJobEvents)

//Fetch profile of mobilizer
mobilizerRouter.get("/profile",verifyMobilizerUsingAccessToken,getMobilizerProfile)

export default mobilizerRouter