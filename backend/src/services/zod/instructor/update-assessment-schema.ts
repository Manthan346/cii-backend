import {z} from "zod";
import { assessment_type } from "../../../generated/prisma/enums";

export const updateAssessmentSchema = z.object({

    assessment_id:z
    .uuid(),

    title:z
    .string()
    .trim()
    .min(3)
    .optional(),

    assessment_desc:z
    .string()
    .trim()
    .min(3)
    .optional(),

    assessment_type:z
    .nativeEnum(assessment_type)
    .optional(),

    assessment_date: z
    .iso
    .date()
    .optional(),

    questions:z
    .int()
    .min(1)
    .optional(),

    assessment_duration:z
    .int()
    .min(1)
    .optional(),

    assessment_link: z
    .string()
    .trim()
    .url("Invalid Assessment Link.")
    .nullable()
    .optional(),

    is_show: z
    .boolean()
    .optional()

    
})