import {z} from "zod";

export const createStudyMaterialSchema = z.object({
    batch_id:z
    .uuid(),

    title:z
    .string()
    .trim()
    .min(1),

    description:z
    .string()
    .trim()
    .min(1),

    document_link:z
    .url()

});