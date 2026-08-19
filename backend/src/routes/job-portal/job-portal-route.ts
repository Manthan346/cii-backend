import { Router} from 'express';
import { createPlacementApplication } from '../../controllers/job-application';
import { validateBody } from '../../middlewares/zod-middleware/zod-body-validator';
import { createPlacementApplicationSchema } from '../../services/zod/hr/placement-application-validation';
const jobRouter = Router();

jobRouter.post("/:placementId/apply",validateBody(createPlacementApplicationSchema),createPlacementApplication);

export default jobRouter;