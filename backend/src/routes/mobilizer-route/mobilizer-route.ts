import { Router} from 'express';
import { verifyMobilizerUsingAccessToken } from '../../middlewares/mobilizer-auth-middleware/mobilizer-auth-middleware';
import { getAllEnquiry } from '../../controllers/mobilizer-controller/get-all-enquiry';
import { assignMobilizerToEnquiry } from '../../controllers/mobilizer-controller/assign-mobilizer';
import { getEnquiryDetails } from '../../controllers/mobilizer-controller/get-enquiry-details';
import { changeEnquiryStatus } from '../../controllers/mobilizer-controller/change-enquiry-status';
import { createPublicEvent } from '../../controllers/mobilizer-controller/create-public-event';
import { updatePublicEvent } from '../../controllers/mobilizer-controller/update-public-event';
import { getCenterEvents } from '../../controllers/mobilizer-controller/get-center-events';
import { getEventDetails } from '../../controllers/mobilizer-controller/get-event-details';
import { paginationMiddleware } from '../../middlewares/pagination-middleware/pagination';
import { createEventSchema, updatePublicEventSchema } from '../../services/zod/event-schema/eventValidation';
import { validateBody } from '../../middlewares/zod-middleware/zod-body-validator';
import { uploadEventImages } from '../../middlewares/multer-middleware/image-upload';

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

// Mobilizer can create PUBLIC events to surface on the landing page
mobilizerRouter.post(
    "/create-public-event",
    verifyMobilizerUsingAccessToken,
    validateBody(createEventSchema),
    createPublicEvent
);

// Mobilizer can update PUBLIC events
mobilizerRouter.patch(
    "/update-public-event/:event_id",
    verifyMobilizerUsingAccessToken,
    uploadEventImages,
    validateBody(updatePublicEventSchema),
    updatePublicEvent
);

// Mobilizer can get all events associated with their center
mobilizerRouter.get(
    "/center-events",
    verifyMobilizerUsingAccessToken,
    paginationMiddleware,
    getCenterEvents
);

// Mobilizer can get specific event details
mobilizerRouter.get(
    "/event-details/:eventId",
    verifyMobilizerUsingAccessToken,
    getEventDetails
);

export default mobilizerRouter