import { Router } from "express";
import { createEnquiry } from "../../controllers/enquiry-controller/create-enquiry";
import { getCoursesByCenter,  } from "../../controllers/enquiry-controller/get-courses-by-center";
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


export default enquiryRouter;