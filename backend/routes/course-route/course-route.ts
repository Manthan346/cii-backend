import { Router } from "express";
import { createCourse } from "../../src/controllers/courses-controllers/course-create";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-body-validator";
import { courseSchema } from "../../src/services/zod/course-schema/course-schema";


const courseRouter = Router()

courseRouter.post('/create-course', validateBody(courseSchema),createCourse)

export {
    courseRouter
}