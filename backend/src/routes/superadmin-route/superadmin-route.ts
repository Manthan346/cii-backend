import { Router } from "express";
import { fetchCentersforDropdown } from "../../controllers/superadmin-controllers/fetch-all-center";
import { verifySuperAdminUsingAccessToken } from "../../middlewares/superadmin-auth-middleware/superadmin-auth-middleware";
import { fetchDashboardData } from "../../controllers/superadmin-controllers/fetch-dashboard-boxData";
import { createCenter } from "../../controllers/superadmin-controllers/create-center";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createCenterSchema } from "../../services/zod/super-admin/center-creation-validation";
import { updateCenterSchema } from "../../services/zod/super-admin/center-creation-validation";
import { updateCenter } from "../../controllers/superadmin-controllers/edit-center-details";

const superAdminRouter = Router()

superAdminRouter.get('/fetchCenters',verifySuperAdminUsingAccessToken,fetchCentersforDropdown)
superAdminRouter.get('/dashboardData',verifySuperAdminUsingAccessToken,fetchDashboardData)
superAdminRouter.post('/createCenter',validateBody(createCenterSchema),verifySuperAdminUsingAccessToken,createCenter)
superAdminRouter.patch('/center/:center_id',validateBody(updateCenterSchema),verifySuperAdminUsingAccessToken,updateCenter)

export default superAdminRouter