import { Router} from 'express';
import { verifyMobilizerUsingAccessToken } from '../../middlewares/mobilizer-auth-middleware/mobilizer-auth-middleware';
import { getAllEnquiry } from '../../controllers/mobilizer-controller/get-all-enquiry';
import { assignMobilizerToEnquiry } from '../../controllers/mobilizer-controller/assign-mobilizer';
import { paginationMiddleware } from '../../middlewares/pagination-middleware/pagination';

const mobilizerRouter = Router();

mobilizerRouter.get(
    "/enquiry-management",
    verifyMobilizerUsingAccessToken,
    paginationMiddleware,
    getAllEnquiry
);

// Assign mobilizer to enquiry
mobilizerRouter.post(
    "/enquiry/:enquiryId/assign",
    verifyMobilizerUsingAccessToken,
    assignMobilizerToEnquiry
);

export default mobilizerRouter