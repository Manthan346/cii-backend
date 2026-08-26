import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { parseJobFairCandidatesExcelBuffer } from "../../utils/excel-parser/job-fair-candidates-excel";

// Valid application status enum values from DB
const VALID_APPLICATION_STATUSES = [
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
  "WITHDRAWN",
];

// Process in chunks to avoid transaction timeout
const CHUNK_SIZE = 50;

export const uploadJobFairCandidates = asyncHandler(
  async (req: Request, res: Response) => {
    const job_event_id: string = String(req.params.job_event_id);

    // Verify job event exists
    const jobEvent = await prisma.job_events.findUnique({
      where: { job_event_id },
      select: { job_event_id: true },
    });

    if (!jobEvent) {
      throw new ApiError(404, "Job event not found");
    }

    // Check if file uploaded
    if (!req.file) {
      throw new ApiError(400, "No Excel file uploaded");
    }

    // Parse Excel buffer
    let candidatesData;
    try {
      candidatesData = await parseJobFairCandidatesExcelBuffer(req.file.buffer);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, "Failed to parse Excel file");
    }

    // Separate valid and invalid rows FIRST (outside transaction)
    const validRows: Array<{ data: any; rowNumber: number }> = [];
    const errors: any[] = [];

    for (const candidate of candidatesData) {
      // Skip completely empty rows
      const hasData = Object.values(candidate).some(
        (v) => v !== undefined && v !== null && v !== ""
      );

      if (!hasData) {
        errors.push({
          row: candidate.rowNumber,
          error: "Row is completely empty, skipped",
        });
        continue;
      }

      // Validate application status if provided
      let applicationStatus: any = null;
      if (
        candidate.candidate_application_status &&
        VALID_APPLICATION_STATUSES.includes(
          candidate.candidate_application_status.toUpperCase()
        )
      ) {
        applicationStatus = candidate.candidate_application_status.toUpperCase();
      } else if (candidate.candidate_application_status) {
        errors.push({
          row: candidate.rowNumber,
          error: `Invalid application status "${candidate.candidate_application_status}". Valid: ${VALID_APPLICATION_STATUSES.join(", ")}`,
        });
        continue;
      }

      // Build data object
      validRows.push({
        rowNumber: candidate.rowNumber,
        data: {
          job_event_id,
          candidate_name: candidate.candidate_name ?? "",
          contact_no: candidate.contact_no ?? "",
          location: candidate.location ?? null,
          qualification: candidate.qualification ?? null,
          college_institute: candidate.college_institute ?? null,
          age: candidate.age ?? null,
          gender: candidate.gender ?? null,
          candidate_experience: candidate.candidate_experience ?? null,
          area: candidate.area ?? null,
          ward_no: candidate.ward_no ?? null,
          vidhansabha: candidate.vidhansabha ?? null,
          company_name: candidate.company_name ?? null,
          candidate_application_status: applicationStatus,
        },
      });
    }

    // Process valid rows in CHUNKED transactions
    const created: any[] = [];

    for (let i = 0; i < validRows.length; i += CHUNK_SIZE) {
      const chunk = validRows.slice(i, i + CHUNK_SIZE);

      const chunkResult = await prisma.$transaction(async (tx) => {
        const chunkCreated: any[] = [];
        for (const row of chunk) {
          try {
            const createdCandidate = await tx.job_fair_candidates.create({
              data: row.data,
            });
            chunkCreated.push({
              job_fair_candidate_id: createdCandidate.job_fair_candidate_id,
              candidate_name: createdCandidate.candidate_name,
              contact_no: createdCandidate.contact_no,
            });
          } catch (err: any) {
            // Individual row failed - log error but continue chunk
            errors.push({
              row: row.rowNumber,
              error: err.message || "Database error",
            });
          }
        }
        return chunkCreated;
      });

      created.push(...chunkResult);
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          job_event_id,
          total_rows_processed: candidatesData.length,
          successful_inserts: created.length,
          failed_rows: errors.length,
          created_candidates: created,
          errors: errors.length > 0 ? errors : undefined,
        },
        `Uploaded ${created.length} candidate(s) to job event${
          errors.length > 0 ? ` (${errors.length} row(s) failed)` : ""
        }`
      )
    );
  }
);