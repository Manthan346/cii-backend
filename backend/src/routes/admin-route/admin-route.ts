import { Router } from "express";
import { verifyAdminUsingAccessToken } from "../../middlewares/admin-auth-middleware/admin-middleware";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createMobilizerSchema } from "../../services/zod/admin/mobilizer-creation-schema";
import { createMobilizerByAdmin } from "../../controllers/admin-controllers/create-mobilizer";
import { createHrSchema } from "../../services/zod/admin/hr-creation-schema";
import { verify } from "node:crypto";
import { createHrByAdmin } from "../../controllers/admin-controllers/create-hr";
import { createInstructorByAdmin } from "../../controllers/admin-controllers/create-instructor";
import { createInstructorSchema } from "../../services/zod/admin/instructor-creation-schema";
import { mobilizerEnrollCandidateSchema } from "../../services/zod/mobilizer-schema/mobilizer-enroll-candidate-schema";
import { adminCreateCandidate } from "../../controllers/admin-controllers/create-candidate";
import { getCenterStats } from "../../controllers/admin-controllers/get-center-stats";
import { getCandidateJourney } from "../../controllers/admin-controllers/get-candidate-journey";
import { getCoursePerformance } from "../../controllers/admin-controllers/get-course-performance";
import { getCourses } from "../../controllers/admin-controllers/get-courses";
import { downloadEnrollmentReport } from "../../controllers/admin-controllers/download-enrollment-report";
import { getDashboardEnrollment } from "../../controllers/admin-controllers/get-dashboard-enrollment";
import { updateUserApproval } from "../../controllers/admin-controllers/update-user-approval";
import { updateUserApprovalSchema } from "../../services/zod/admin/update-user-approval-schema";
import { getAllUsers } from "../../controllers/admin-controllers/fetch-all-ActiveUsers";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { getDeactivatedUsers } from "../../controllers/admin-controllers/fetch-all-DeactivateUsers";
import { getUserStats } from "../../controllers/admin-controllers/get-totaluser-dashboardStats";
import { getCertificateEnrollments } from "../../controllers/admin-controllers/get-batch-enrollments";
import { uploadCandidateCertificate } from "../../controllers/admin-controllers/upload-candidate-certificate";
import { multerErrorHandler } from "../../middlewares/multer-middleware/file-limit-middleware";
import { upload } from "../../middlewares/multer-middleware/multer";

//create mobilizer 
import { getUserProfile } from "../../controllers/admin-controllers/get-user-profile";

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
//view profile of selected users 
adminRouter.get("/total-users/:userId/view-profile",verifyAdminUsingAccessToken,getUserProfile);
//fetch all freezed accounts (center-scoped)
adminRouter.get("/total-users/deactivated",verifyAdminUsingAccessToken,
paginationMiddleware,getDeactivatedUsers);
//total user dashboard stat boxes (center-scoped)
adminRouter.get("/total-users/dashboard",verifyAdminUsingAccessToken,getUserStats)
//fetch all candidate enrollemnts (center-scoped)
adminRouter.get("/candidates/",verifyAdminUsingAccessToken,paginationMiddleware,getCertificateEnrollments);

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

// GET center-scoped courses with pagination & filters
adminRouter.get(
    "/courses",
    verifyAdminUsingAccessToken,
    getCourses
);

// GET enrollment report as Excel - filters: from_month, from_year, to_month, to_year, course_id (optional)
adminRouter.get(
    "/reports/enrollment",
    verifyAdminUsingAccessToken,
    downloadEnrollmentReport
);

// GET dashboard enrollment data - course-wise & monthly (with optional course_id, date range)
adminRouter.get(
    "/dashboard/enrollment",
    verifyAdminUsingAccessToken,
    getDashboardEnrollment
);
//upload certificate for candidate whose enrollment status is active 
adminRouter.post(
    "/candidates/:candidateId/enrollments/:enrollmentId/certificate",
    verifyAdminUsingAccessToken,
    upload.single("certificate"),
    multerErrorHandler,
    uploadCandidateCertificate
);

export default adminRouter
