import { z } from "zod";

export const updateUserApprovalSchema = z.object({
    admin_approval: z.boolean(),
});