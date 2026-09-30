import { Router } from "express";
import { fetchCentersforDropdown } from "../../controllers/superadmin-controllers/fetch-all-center";
import { verifySuperAdminUsingAccessToken } from "../../middlewares/superadmin-auth-middleware/superadmin-auth-middleware";
import { fetchDashboardData } from "../../controllers/superadmin-controllers/fetch-dashboard-boxData";
import { createCenter } from "../../controllers/superadmin-controllers/create-center";
import { createAdminBySuperAdmin } from "../../controllers/superadmin-controllers/create-admin";
import { getEnrollmentTrend } from "../../controllers/superadmin-controllers/get-enrollment-trend";
import { getCenterWiseEnrollment } from "../../controllers/superadmin-controllers/get-center-wise-enrollment";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createCenterSchema } from "../../services/zod/super-admin/center-creation-validation";
import { createAdminBySuperAdminSchema } from "../../services/zod/super-admin/admin-creation-validation";

const superAdminRouter = Router()

superAdminRouter.get('/fetchCenters', verifySuperAdminUsingAccessToken, fetchCentersforDropdown)
superAdminRouter.get('/dashboardData', verifySuperAdminUsingAccessToken, fetchDashboardData)
superAdminRouter.post('/createCenter', validateBody(createCenterSchema), verifySuperAdminUsingAccessToken, createCenter)
superAdminRouter.post('/createAdmin', validateBody(createAdminBySuperAdminSchema), verifySuperAdminUsingAccessToken, createAdminBySuperAdmin)
superAdminRouter.get('/enrollment-trend', verifySuperAdminUsingAccessToken, getEnrollmentTrend)
superAdminRouter.get('/center-wise-enrollment', verifySuperAdminUsingAccessToken, getCenterWiseEnrollment)

export default superAdminRouter