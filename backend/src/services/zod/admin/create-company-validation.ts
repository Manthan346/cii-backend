import { z } from "zod";

export const createCompanySchema = z.object({
    company_name: z
        .string()
        .trim()
        .regex(/[A-Za-z]/, "Company Name must contain at least one letter.")
        .min(3, "Company Name is too short must be atleast 3 letters.")
        .max(100, "Company name must not exceed 100 characters"),

    company_description: z
        .string()
        .trim()
        .regex(/[A-Za-z]/, "Company Name must contain at least one letter.")
        .min(10, "Company Description is required.")

    
});