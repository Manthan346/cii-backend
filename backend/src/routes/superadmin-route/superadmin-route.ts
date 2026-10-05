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
import { updateCenterSchema } from "../../services/zod/super-admin/center-creation-validation";
import { updateCenter } from "../../controllers/superadmin-controllers/edit-center-details";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { fetchAllCenterDetails } from "../../controllers/superadmin-controllers/fetch-all-centerDetails";

const superAdminRouter = Router()

//create admin
superAdminRouter.post('/createAdmin', validateBody(createAdminBySuperAdminSchema), verifySuperAdminUsingAccessToken, createAdminBySuperAdmin)
superAdminRouter.get('/enrollment-trend', verifySuperAdminUsingAccessToken, getEnrollmentTrend)
superAdminRouter.get('/center-wise-enrollment', verifySuperAdminUsingAccessToken, getCenterWiseEnrollment)
//fetch all center dropdown
superAdminRouter.get('/fetchCenters',verifySuperAdminUsingAccessToken,fetchCentersforDropdown)
//to show dashboard data
superAdminRouter.get('/dashboardData',verifySuperAdminUsingAccessToken,fetchDashboardData)
//to create a center
superAdminRouter.post('/createCenter',validateBody(createCenterSchema),verifySuperAdminUsingAccessToken,createCenter)
//to edit details of a center 
superAdminRouter.patch('/center/:center_id',validateBody(updateCenterSchema),verifySuperAdminUsingAccessToken,updateCenter)
//fetch details of all center
superAdminRouter.get('/center/details',verifySuperAdminUsingAccessToken,paginationMiddleware,fetchAllCenterDetails)

export default superAdminRouter