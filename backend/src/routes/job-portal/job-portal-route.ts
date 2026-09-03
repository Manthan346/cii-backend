import { Router} from 'express';
import { createPlacementApplication } from '../../controllers/job-application';
import { validateBody } from '../../middlewares/zod-middleware/zod-body-validator';
import { createPlacementApplicationSchema } from '../../services/zod/hr/placement-application-validation';
import { getPublicJobPostings } from '../../controllers/get-all-jobsPublic';
const jobRouter = Router();

jobRouter.post("/:placementId/apply",validateBody(createPlacementApplicationSchema),createPlacementApplication);
jobRouter.get("/", getPublicJobPostings);

export default jobRouter;