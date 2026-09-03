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
import { getAllJobEvents } from '../../controllers/mobilizer-controller/get-all-jobEvents';
import { getJobEventDetails } from '../../controllers/mobilizer-controller/get-job-event-details';
import { getMobilizerCandidates } from '../../controllers/mobilizer-controller/get-mobilizer-candidates';
import { getMobilizerProfile } from '../../controllers/mobilizer-controller/get-profile';
import { editMobilizerProfile } from '../../controllers/mobilizer-controller/edit-profile';
import { editMobilizerProfileSchema } from '../../services/zod/mobilizer-schema/mobilizer-edit-schema';
import { addJobEventImages } from '../../controllers/mobilizer-controller/add-jobevent-images';
import { getDashboardStats } from '../../controllers/mobilizer-controller/dashboard-stats';
import { getDashboardCharts } from '../../controllers/mobilizer-controller/dashboard-charts';
import { getEnquiryStats } from '../../controllers/mobilizer-controller/enquiry-stats';
import { getMobilizerNotifications } from '../../controllers/mobilizer-controller/get-notifications';
import { mobilizerEnrollCandidate } from '../../controllers/mobilizer-controller/enroll-candidate';
import { mobilizerEnrollCandidateSchema } from '../../services/zod/mobilizer-schema/mobilizer-enroll-candidate-schema';

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

// Add images (up to 10) to a specific job event
mobilizerRouter.post(
    "/job-event/:job_event_id/images",
    verifyMobilizerUsingAccessToken,
    uploadEventImages,
    addJobEventImages
);

// Get specific job event details with candidates
mobilizerRouter.get(
    "/job-event/:job_event_id",
    verifyMobilizerUsingAccessToken,
    getJobEventDetails
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
mobilizerRouter.patch("/enquiry/:enquiryId/status",verifyMobilizerUsingAccessToken,changeEnquiryStatus);
//Fetch profile of mobilizer
mobilizerRouter.get("/profile",verifyMobilizerUsingAccessToken,getMobilizerProfile)

// Edit own profile (name + mobile ONLY, identity from token)
mobilizerRouter.patch(
    "/profile",
    verifyMobilizerUsingAccessToken,
    validateBody(editMobilizerProfileSchema),
    editMobilizerProfile
);

// Dashboard stats for the mobilizer (center-scoped)
mobilizerRouter.get(
    "/dashboard-stats",
    verifyMobilizerUsingAccessToken,
    getDashboardStats
);

// Dashboard charts for the mobilizer (center-scoped):
// weekly_enrollment, candidate_distribution, weekly_calls
mobilizerRouter.get(
    "/dashboard-charts",
    verifyMobilizerUsingAccessToken,
    getDashboardCharts
);

// Enquiry stat cards for the mobilizer (center-scoped):
// Total, Pending, Not Connected, Center Visited
mobilizerRouter.get(
    "/enquiry-stats",
    verifyMobilizerUsingAccessToken,
    getEnquiryStats
);

// Get the mobilizer's own notifications (flat list, cursor pagination)
mobilizerRouter.get(
    "/notifications",
    verifyMobilizerUsingAccessToken,
    getMobilizerNotifications
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

// Mobilizer enroll candidate (center-scoped)
mobilizerRouter.post(
    "/enroll-candidate",
    verifyMobilizerUsingAccessToken,
    validateBody(mobilizerEnrollCandidateSchema),
    mobilizerEnrollCandidate
);

// Get all candidates for this mobilizer's center (enrolled or not) - paginated
mobilizerRouter.get(
    "/candidates",
    verifyMobilizerUsingAccessToken,
    paginationMiddleware,
    getMobilizerCandidates
);

export default mobilizerRouter