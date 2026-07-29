import { Router } from "express";
import { createCourse } from "../../controllers/courses-controllers/course-create";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";
import { courseSchema } from "../../services/zod/course-schema/course-schema";


const courseRouter = Router()

courseRouter.post('/create-course', validateBody(courseSchema),createCourse)

export {
    courseRouter
}