import { Router } from "express";
import { fetchCentersforDropdown } from "../../controllers/superadmin-controllers/fetch-all-center";
import { verifySuperAdminUsingAccessToken } from "../../middlewares/superadmin-auth-middleware/superadmin-auth-middleware";
import { fetchDashboardData } from "../../controllers/superadmin-controllers/fetch-dashboard-boxData";
import { createCenter } from "../../controllers/superadmin-controllers/create-center";
import { createAdminBySuperAdmin } from "../../controllers/superadmin-controllers/create-admin";
import { getEnrollmentTrend } from "../../controllers/superadmin-controllers/get-enrollment-trend";
import { getCenterWiseEnrollment } from "../../controllers/superadmin-controllers/get-center-wise-enrollment";
import { downloadSuperAdminEnrollmentReport } from "../../controllers/superadmin-controllers/download-enrollment-report";
import { updateCenter } from "../../controllers/superadmin-controllers/edit-center-details";
import { paginationMiddleware } from "../../middlewares/pagination-middleware/pagination";
import { fetchAllCenterDetails } from "../../controllers/superadmin-controllers/fetch-all-centerDetails";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { validateQuery } from "../../middlewares/zod-middleware/zod-query-validator";
import { createCenterSchema } from "../../services/zod/super-admin/center-creation-validation";
import { createAdminBySuperAdminSchema } from "../../services/zod/super-admin/admin-creation-validation";
import { updateCenterSchema } from "../../services/zod/super-admin/center-creation-validation";
import { downloadSuperAdminEnrollmentReportQuerySchema } from "../../services/zod/super-admin/enrollment-report-validation";
import { monthlyEnrollmentQuerySchema } from "../../services/zod/super-admin/monthly-enrollment-validation";
import { getMonthlyEnrollmentData } from "../../controllers/superadmin-controllers/get-monthly-enrollment";

const superAdminRouter = Router()

// fetch all center dropdown
superAdminRouter.get('/fetchCenters', verifySuperAdminUsingAccessToken, fetchCentersforDropdown)
// to show dashboard data
superAdminRouter.get('/dashboardData', verifySuperAdminUsingAccessToken, fetchDashboardData)
// to create a center
superAdminRouter.post('/createCenter', validateBody(createCenterSchema), verifySuperAdminUsingAccessToken, createCenter)
// to edit details of a center
superAdminRouter.patch('/center/:center_id', validateBody(updateCenterSchema), verifySuperAdminUsingAccessToken, updateCenter)
// fetch details of all center
superAdminRouter.get('/center/details', verifySuperAdminUsingAccessToken, paginationMiddleware, fetchAllCenterDetails)

// create admin
superAdminRouter.post('/createAdmin', validateBody(createAdminBySuperAdminSchema), verifySuperAdminUsingAccessToken, createAdminBySuperAdmin)
// enrollment trend
superAdminRouter.get('/enrollment-trend', verifySuperAdminUsingAccessToken, getEnrollmentTrend)
// center-wise enrollment (optional center_id param)
superAdminRouter.get('/center-wise-enrollment{/:center_id}', verifySuperAdminUsingAccessToken, getCenterWiseEnrollment)
// download enrollment report (superadmin) - query: from_date, to_date, center_id (optional)
superAdminRouter.get('/reports/enrollment', verifySuperAdminUsingAccessToken, validateQuery(downloadSuperAdminEnrollmentReportQuerySchema), downloadSuperAdminEnrollmentReport)

// get monthly enrollment data (superadmin) - query: from=MM/YYYY, to=MM/YYYY, center_id (optional)
superAdminRouter.get('/reports/enrollment/monthly', verifySuperAdminUsingAccessToken, validateQuery(monthlyEnrollmentQuerySchema), getMonthlyEnrollmentData)

export default superAdminRouter