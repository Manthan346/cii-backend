import { Router } from "express";
import { verifyAdminUsingAccessToken } from "../../middlewares/admin-auth-middleware/admin-middleware";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createMobilizerSchema } from "../../services/zod/admin/mobilizer-creation-schema";
import { createMobilizerByAdmin } from "../../controllers/admin-controllers/create-mobilizer";
import { createHrSchema } from "../../services/zod/admin/hr-creation-schema";
import { verify } from "node:crypto";
import { createHrByAdmin } from "../../controllers/admin-controllers/create-hr";

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

export default adminRouter
