import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { parseAttendanceExcelBuffer } from "../../utils/excel-parser/attendance-excel-parser";
import { attendanceSessionRowSchema } from "../../services/zod/instructor/session-excel-schema";

type RowResult = { rowNumber: number; status: "created" | "failed"; reason?: string; batch_code?: string };

export const createAttendanceSessionsFromExcel = asyncHandler(
  async (req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id;
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!file) {
      throw new ApiError(400, "No file uploaded");
    }

    const rawRows = await parseAttendanceExcelBuffer(file.buffer);

    // Resolve every distinct batch_code mentioned in the sheet to its real
    // batch_id in one query — scoped to this instructor's own batches, so a
    // code belonging to someone else simply won't resolve at all.
    const uniqueBatchCodes = [...new Set(rawRows.map((r) => r.batch_code).filter(Boolean))];
    const batches = await prisma.batch_details.findMany({
      where: { batch_code: { in: uniqueBatchCodes }, instructor_id: instructorId },
      select: { batch_id: true, batch_code: true, b_status: true, batch_start_date: true, batch_end_date: true },
    });
    const batchMap = new Map(batches.map((b) => [b.batch_code, b]));

    const results: RowResult[] = [];
    const rowsToInsert: {
      batch_id: string;
      instructor_id: string;
      session_date: Date;
      attendance_mode: "offline" | "online";
      session_time?: Date;
      room_no?: string;
      topic_name?: string;
      rowNumber: number;
      batch_code: string; // kept only for result-reporting, not for the DB insert
    }[] = [];
//     console.log("Raw row:", rawRows);
// console.log("Raw session_date:", );
// console.log("Type:", typeof row.session_date);

    for (const rawRow of rawRows) {
//           console.log("=================================");
//   console.log("Raw Row:", rawRow);
//   console.log("session_date:", rawRow.session_date);
//   console.log("session_date type:", typeof rawRow.session_date);
      const parsed = attendanceSessionRowSchema.safeParse({
        batch_code: rawRow.batch_code,
        session_date: rawRow.session_date,
        attendance_mode: rawRow.attendance_mode,
        session_time: rawRow.session_time || undefined,
        room_no: rawRow.room_no || undefined,
        topic_name: rawRow.topic_name || undefined,

      });

      if (!parsed.success) {
        results.push({
          rowNumber: rawRow.rowNumber,
          status: "failed",
          reason: parsed.error.issues.map((i: any) => i.message).join("; "),
        });
        continue;
      }

      const row = parsed.data;

      const batch = batchMap.get(row.batch_code);
      if (!batch) {
        results.push({
          rowNumber: rawRow.rowNumber,
          status: "failed",
          reason: "batch not found, not yours, or batch_code is incorrect",
          batch_code: row.batch_code,
        });
        continue;
      }

      console.log(JSON.stringify(row.session_date));
      if (batch.b_status !== "ACTIVE") {
        results.push({
          rowNumber: rawRow.rowNumber,
          status: "failed",
          reason: `batch is not active (${batch.b_status})`,
          batch_code: row.batch_code,
        });
        continue;
      }
      if (row.session_date < batch.batch_start_date || row.session_date > batch.batch_end_date) {
        results.push({
          rowNumber: rawRow.rowNumber,
          status: "failed",
          reason: "session_date falls outside the batch's date range",
          batch_code: row.batch_code,
        });
        continue;
      }

      let sessionTime: Date | undefined;
      

if (row.session_time) {
  const [hh, mm] = row.session_time.split(":").map(Number);

  sessionTime = new Date(Date.UTC(1970, 0, 1, hh, mm, 0));
}
      console.log(sessionTime)

      rowsToInsert.push({
        batch_id: batch.batch_id, // resolved from the DB — never trust the sheet for the real FK
        instructor_id: instructorId!,
        session_date: row.session_date,
        attendance_mode: row.attendance_mode,
        session_time: sessionTime,
        room_no: row.room_no,
        topic_name: row.topic_name,
        batch_code: row.batch_code,
        rowNumber: rawRow.rowNumber,
      });
    }

    if (rowsToInsert.length > 0) {
      const existingSessions = await prisma.attendance_sessions.findMany({
        where: { OR: rowsToInsert.map((r) => ({ batch_id: r.batch_id, session_date: r.session_date })) },
        select: { batch_id: true, session_date: true },
      });
      const existingKeys = new Set(
        existingSessions.map((s) => `${s.batch_id}_${s.session_date.toISOString().slice(0, 10)}`)
      );

      const seenInSheet = new Set<string>();
      const dedupedRows = rowsToInsert.filter((r) => {
        const key = `${r.batch_id}_${r.session_date.toISOString().slice(0, 10)}`;
        if (existingKeys.has(key)) {
          results.push({
            rowNumber: r.rowNumber,
            status: "failed",
            reason: "a session already exists for this batch on this date",
            batch_code: r.batch_code,
          });
          return false;
        }
        if (seenInSheet.has(key)) {
          results.push({
            rowNumber: r.rowNumber,
            status: "failed",
            reason: "duplicate batch_code + session_date within the uploaded file",
            batch_code: r.batch_code,
          });
          return false;
        }
        seenInSheet.add(key);
        return true;
      });

      if (dedupedRows.length > 0) {
        await prisma.attendance_sessions.createMany({
          data: dedupedRows.map((r) => ({
            batch_id: r.batch_id,
            instructor_id: r.instructor_id,
            session_date: r.session_date,
            attendance_mode: r.attendance_mode,
            session_time: r.session_time,
            room_no: r.room_no,
            topic_name: r.topic_name,
            // batch_code intentionally NOT included — no such column on attendance_sessions
          })),
          skipDuplicates: true,
        });
        dedupedRows.forEach((r) =>
          results.push({ rowNumber: r.rowNumber, status: "created", batch_code: r.batch_code })
        );
      }
    }

    const createdCount = results.filter((r) => r.status === "created").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    return res.status(createdCount > 0 ? 201 : 400).json(
      new ApiResponse(
        createdCount > 0 ? 201 : 400,
        { totalRows: rawRows.length, createdCount, failedCount, results: results.sort((a, b) => a.rowNumber - b.rowNumber) },
        `${createdCount} session(s) created, ${failedCount} failed`
      )
    );
  }
);