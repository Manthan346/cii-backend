import { z } from "zod";
import { enquiry_status } from "../../../generated/prisma/client";

export const createEnquirySchema = z.object({
  enquiry_first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),

  enquiry_last_name: z
    .string()
    .trim()
    .max(100, "Last name cannot exceed 100 characters")
    .optional(),

  enquiry_email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),

  enquiry_phone_no: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .min(10, "Phone number is required")
    .max(15, "Phone number cannot exceed 15 characters"),

  enquiry_education: z
    .string()
    .trim()
    .max(100, "Education cannot exceed 100 characters")
    .optional(),

  enquiry_location: z
    .string()
    .trim()
    .optional(),

  enquiry_source: z
    .string()
    .trim()
    .max(100, "Enquiry source cannot exceed 100 characters")
    .optional(),

  remarks: z
    .string()
    .trim()
    .optional(),

  // Optional: course_id if they select a specific course
  course_id: z
    .string()
    .uuid("Invalid course ID")
    .optional(),

  center_id: z
    .string()
    .uuid("Invalid center ID")
  // enq_status will be set to CALL_RECIEVED by default in the controller
});