import { z } from "zod";

export const companySchema = z.object({
  company_name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),

  company_description: z
    .string()
    .min(10, "Company description must be at least 10 characters")
    .max(1000, "Company description is too long"),
});

export type CompanyInput = z.infer<typeof companySchema>;