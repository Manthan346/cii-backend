import { z } from "zod";

export const attendanceSessionRowSchema = z.object({
  batch_code: z.string().min(1, "batch_code is required"),
  session_date: z.coerce.date("session_date is invalid or missing"),
  attendance_mode: z.enum(["offline", "online"], "attendance_mode must be one of: offline, online"),
  session_time: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, "session_time must be in HH:mm format")
    .optional(),
  room_no: z.string().max(100, "room_no exceeds maximum length of 100 characters").optional(),
  topic_name: z.string().optional(),
});

export type AttendanceSessionRow = z.infer<typeof attendanceSessionRowSchema>;