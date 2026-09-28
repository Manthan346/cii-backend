import { Router } from "express";
import { fetchCentersforDropdown } from "../../controllers/superadmin-controllers/fetch-all-center";
import { verifySuperAdminUsingAccessToken } from "../../middlewares/superadmin-auth-middleware/superadmin-auth-middleware";

const superAdminRouter = Router()

superAdminRouter.get('/fetchCenters',verifySuperAdminUsingAccessToken,fetchCentersforDropdown)

export default superAdminRouter