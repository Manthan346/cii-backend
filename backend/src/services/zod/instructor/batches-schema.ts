import { z } from "zod";

export const instructorBatchesQuerySchema = z.object({
  search: z.string().optional(),
  courseType: z.enum(["online", "offline", "hybrid"], "invalid course type").optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "INACTIVE"], "invalid status type").optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type instructorBatchQuery = z.infer<typeof instructorBatchesQuerySchema>;