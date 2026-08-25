import { z } from "zod";

export const updateUserApprovalSchema = z.object({
    is_active: z.boolean(),
});