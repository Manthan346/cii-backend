import { Router } from "express";
import { createEnquiry } from "../../controllers/enquiry-controller/create-enquiry";
import { getCoursesByCenter } from "../../controllers/enquiry-controller/get-courses-by-center";
import { getAllCenters } from "../../controllers/enquiry-controller/get-all-centers";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { createEnquirySchema } from "../../services/zod/enquiry-schema/enquiryValidation";

const enquiryRouter = Router();

// Public enquiry creation endpoint — no auth required (landing page form)
enquiryRouter.post(
  "/create-enquiry",
  validateBody(createEnquirySchema),
  createEnquiry
);

// Get courses by center ID — for frontend to fetch courses after center selection (POST with body)
enquiryRouter.post("/courses-by-center", getCoursesByCenter);

// Get courses simple - only course_id and course_name for dropdowns (GET with query param)
// Usage: GET /api/v1/enquiry/courses?center_id=<uuid>


// Get all centers simple - only center_id and center_name for dropdowns (GET)
// Usage: GET /api/v1/enquiry/centers
enquiryRouter.get("/centers", getAllCenters);

export default enquiryRouter;