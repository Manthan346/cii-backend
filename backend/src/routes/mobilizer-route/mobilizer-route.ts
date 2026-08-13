import { Router} from 'express';
import { verifyMobilizerUsingAccessToken } from '../../middlewares/mobilizer-auth-middleware/mobilizer-auth-middleware';
import { getAllEnquiry } from '../../controllers/mobilizer-controller/get-all-enquiry';
import { assignMobilizerToEnquiry } from '../../controllers/mobilizer-controller/assign-mobilizer';
import { getEnquiryDetails } from '../../controllers/mobilizer-controller/get-enquiry-details';
import { changeEnquiryStatus } from '../../controllers/mobilizer-controller/change-enquiry-status';
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

// Assign mobilizer to enquiry
mobilizerRouter.post(
    "/enquiry/:enquiryId/assign",
    verifyMobilizerUsingAccessToken,
    assignMobilizerToEnquiry
);

// Get enquiry details with status history
mobilizerRouter.get(
    "/enquiry/:enquiryId",
    verifyMobilizerUsingAccessToken,
    getEnquiryDetails
);

// Change enquiry status
mobilizerRouter.patch("/enquiry/:enquiryId/status",verifyMobilizerUsingAccessToken,changeEnquiryStatus);
//Fetch profile of mobilizer
mobilizerRouter.get("/profile",verifyMobilizerUsingAccessToken,getMobilizerProfile)

export default mobilizerRouter