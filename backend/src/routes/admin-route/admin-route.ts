import { Router } from "express";
import { verifyAdminUsingAccessToken } from "../../middlewares/admin-auth-middleware/admin-middleware";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createMobilizerSchema } from "../../services/zod/admin/mobilizer-creation-schema";
import { createMobilizerByAdmin } from "../../controllers/admin-controllers/create-mobilizer";
import { createHrSchema } from "../../services/zod/admin/hr-creation-schema";
import { createHrByAdmin } from "../../controllers/admin-controllers/create-hr";
import { createInstructorByAdmin } from "../../controllers/admin-controllers/create-instructor";
import { createInstructorSchema } from "../../services/zod/admin/instructor-creation-schema";
import { mobilizerEnrollCandidateSchema } from "../../services/zod/mobilizer-schema/mobilizer-enroll-candidate-schema";
import { adminCreateCandidate } from "../../controllers/admin-controllers/create-candidate";
import { getCenterStats } from "../../controllers/admin-controllers/get-center-stats";
import { getCandidateJourney } from "../../controllers/admin-controllers/get-candidate-journey";
import { getCoursePerformance } from "../../controllers/admin-controllers/get-course-performance";
import { updateUserApproval } from "../../controllers/admin-controllers/update-user-approval";
import { updateUserApprovalSchema } from "../../services/zod/admin/update-user-approval-schema";
import { getAllUsers } from "../../controllers/admin-controllers/fetch-all-ActiveUsers";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { getDeactivatedUsers } from "../../controllers/admin-controllers/fetch-all-DeactivateUsers";

const adminRouter = Router();

//create mobilizer
adminRouter.post(
    "/total-users/create-mobilizer",
    verifyAdminUsingAccessToken,
    validateBody(createMobilizerSchema),
    createMobilizerByAdmin
);
//create hr
adminRouter.post('/total-users/create-hr',verifyAdminUsingAccessToken,validateBody(createHrSchema),createHrByAdmin);
//create instructor
adminRouter.post('/total-users/create-instructor',verifyAdminUsingAccessToken,validateBody(createInstructorSchema),createInstructorByAdmin);
//freeze account functionality 
adminRouter.patch("/total-users/:userId/approval",verifyAdminUsingAccessToken,
validateBody(updateUserApprovalSchema),updateUserApproval);
//fetch all active users 
adminRouter.get("/total-users",verifyAdminUsingAccessToken,paginationMiddleware,
getAllUsers);
//fetch all freezed accounts
adminRouter.get("/total-users/deactivated",verifyAdminUsingAccessToken,
paginationMiddleware,getDeactivatedUsers);

//create candidate (same flow as mobilizer enroll-candidate, with center isolation from admin token)
adminRouter.post(
    "/candidates/create",
    verifyAdminUsingAccessToken,
    validateBody(mobilizerEnrollCandidateSchema),
    adminCreateCandidate
);

// GET center-scoped stats: total users, total instructors, total candidates, new users this month
adminRouter.get(
    "/center/stats",
    verifyAdminUsingAccessToken,
    getCenterStats
);

// GET center-scoped candidate journey: Enquiry → Enrolled → Training → Completed → Certified
adminRouter.get(
    "/center/candidate-journey",
    verifyAdminUsingAccessToken,
    getCandidateJourney
);

// GET center-scoped course performance
adminRouter.get(
    "/center/course-performance",
    verifyAdminUsingAccessToken,
    getCoursePerformance
);

export default adminRouter
