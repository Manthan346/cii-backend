import { Router} from 'express';
import { verifyMobilizerUsingAccessToken } from '../../middlewares/mobilizer-auth-middleware/mobilizer-auth-middleware';
import { getAllEnquiry } from '../../controllers/mobilizer-controller/get-all-enquiry';
import { assignMobilizerToEnquiry } from '../../controllers/mobilizer-controller/assign-mobilizer';
import { getEnquiryDetails } from '../../controllers/mobilizer-controller/get-enquiry-details';
import { changeEnquiryStatus } from '../../controllers/mobilizer-controller/change-enquiry-status';
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

// Get enquiry details with status history
mobilizerRouter.get(
    "/enquiry/:enquiryId",
    verifyMobilizerUsingAccessToken,
    getEnquiryDetails
);

// Change enquiry status
mobilizerRouter.patch(
    "/enquiry/:enquiryId/status",
    verifyMobilizerUsingAccessToken,
    changeEnquiryStatus
);

export default mobilizerRouter