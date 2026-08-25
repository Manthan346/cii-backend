import { z } from "zod";
import { role_types } from "../../../generated/prisma/enums";

export const getUsersSchema = z.object({
    role: z
        .nativeEnum(role_types)
        .optional(),

    search: z
        .string()
        .trim()
        .min(1, "Search cannot be empty")
        .optional(),
});