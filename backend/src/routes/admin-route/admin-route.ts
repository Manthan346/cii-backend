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
import { updateUserApproval } from "../../controllers/admin-controllers/update-user-approval";
import { updateUserApprovalSchema } from "../../services/zod/admin/update-user-approval-schema";

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

export default adminRouter
