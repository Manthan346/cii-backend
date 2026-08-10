import { z } from "zod";

export const attendanceEntrySchema = z.object({
  candidateId: z.string().uuid("candidateId must be a valid UUID"),
  attendanceStatus: z.enum(
    ["present", "absent", "late"],
    "attendanceStatus must be one of: present, absent, late"
  ),
  remarks: z.string().max(255, "remarks exceeds maximum length").optional(),
});

export const addAttendanceBodySchema = z.object({
  attendance: z.array(attendanceEntrySchema).min(1, "at least one attendance entry is required"),
});

export type AttendanceEntry = z.infer<typeof attendanceEntrySchema>;
export type AddAttendanceBody = z.infer<typeof addAttendanceBodySchema>;