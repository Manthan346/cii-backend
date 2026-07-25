import { z } from "zod";

export const updateStudyMaterialSchema = z
.object({

    study_material_id: z
    .uuid(),

    title: z
    .string()
    .trim()
    .min(1)
    .optional(),

    description: z
    .string()
    .trim()
    .min(1)
    .optional(),

    document_link: z
    .url()
    .optional(),

    is_show: z
    .boolean()
    .optional()

})
.refine(

    (data)=>

        data.title !== undefined ||

        data.description !== undefined ||

        data.document_link !== undefined ||

        data.is_show !== undefined,

    {

        message:
        "At least one field must be provided for update."

    }

);