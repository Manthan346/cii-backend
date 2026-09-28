import { Router } from "express";
import { fetchCentersforDropdown } from "../../controllers/superadmin-controllers/fetch-all-center";
import { verifySuperAdminUsingAccessToken } from "../../middlewares/superadmin-auth-middleware/superadmin-auth-middleware";
import { fetchDashboardData } from "../../controllers/superadmin-controllers/fetch-dashboard-boxData";

const superAdminRouter = Router()

superAdminRouter.get('/fetchCenters',verifySuperAdminUsingAccessToken,fetchCentersforDropdown)
superAdminRouter.get('/dashboardData',verifySuperAdminUsingAccessToken,fetchDashboardData)

export default superAdminRouter