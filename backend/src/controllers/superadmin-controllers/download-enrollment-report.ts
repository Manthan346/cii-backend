import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import ExcelJS from "exceljs";

export const downloadSuperAdminEnrollmentReport = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {
        const { center_id, from_date, to_date } = req.query;

        // Validate required params
        if (!from_date || !to_date) {
            throw new ApiError(400, "Both from_date and to_date are required");
        }

        if (Array.isArray(from_date) || Array.isArray(to_date) || (center_id && Array.isArray(center_id))) {
            throw new ApiError(400, "Query parameters must be single values");
        }

        const centerId = center_id as string | undefined;
        const fromDate = from_date as string;
        const toDate = to_date as string;

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
            throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
        }

        const enrollmentFromDate = new Date(`${fromDate}T00:00:00.000Z`);
        const enrollmentToDate = new Date(`${toDate}T23:59:59.999Z`);

        if (isNaN(enrollmentFromDate.getTime()) || isNaN(enrollmentToDate.getTime())) {
            throw new ApiError(400, "Invalid from_date or to_date");
        }

        if (enrollmentFromDate > enrollmentToDate) {
            throw new ApiError(400, "from_date must be before or equal to to_date");
        }

        // If center_id provided, validate it exists
        let centerName = "All Centers";
        if (centerId) {
            const center = await prisma.center_details.findUnique({
                where: { center_id: centerId },
                select: { center_name: true },
            });
            if (!center) {
                throw new ApiError(404, "Center not found");
            }
            centerName = center.center_name;
        }

        // Fetch all companies (with center filter if provided)
        const companies = await prisma.company_details.findMany({
            where: centerId
                ? {
                      center_company: {
                          some: {
                              center_id: centerId,
                          },
                      },
                  }
                : undefined,
            select: {
                company_id: true,
                company_name: true,
                course_details: {
                    where: {
                        batch_details: {
                            some: {
                                ...(centerId
                                    ? { center_id: centerId }
                                    : {}),
                                batch_enrollment: {
                                    some: {
                                        enrollment_date: {
                                            gte: enrollmentFromDate,
                                            lte: enrollmentToDate,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    select: {
                        course_id: true,
                        course_name: true,
                        batch_details: {
                            where: {
                                ...(centerId
                                    ? { center_id: centerId }
                                    : {}),
                                batch_enrollment: {
                                    some: {
                                        enrollment_date: {
                                            gte: enrollmentFromDate,
                                            lte: enrollmentToDate,
                                        },
                                    },
                                },
                            },
                            select: {
                                batch_id: true,
                                batch_name: true,
                                batch_enrollment: {
                                    where: {
                                        enrollment_date: {
                                            gte: enrollmentFromDate,
                                            lte: enrollmentToDate,
                                        },
                                    },
                                    select: {
                                        enrollment_id: true,
                                        candidate_id: true,
                                        enrollment_date: true,
                                        enrollment_status: true,
                                        candidates_details: {
                                            select: {
                                                candidate_unique_id: true,
                                                candidate_first_name: true,
                                                candidate_last_name: true,
                                                contact_number: true,
                                                current_city: true,
                                                permanent_city: true,
                                                user_login: {
                                                    select: {
                                                        user_email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    orderBy: {
                                        enrollment_date: "asc",
                                    },
                                },
                            },
                            orderBy: {
                                batch_start_date: "asc",
                            },
                        },
                    },
                    orderBy: {
                        course_name: "asc",
                    },
                },
            },
            orderBy: {
                company_name: "asc",
            },
        });

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Enrollment Report");

        // Title row
        const titleRow = worksheet.addRow([`Enrollment Report - ${centerName}`]);
        titleRow.font = { bold: true, size: 16 };
        worksheet.mergeCells(titleRow.number, 1, titleRow.number, 7);

        // Date range row
        const dateRow = worksheet.addRow([`Enrollment Period: ${fromDate} to ${toDate}`]);
        dateRow.font = { italic: true };
        worksheet.mergeCells(dateRow.number, 1, dateRow.number, 7);

        worksheet.addRow([]);

        let hasData = false;

        for (const company of companies) {
            // Company heading
            const companyRow = worksheet.addRow([`Company: ${company.company_name}`]);
            companyRow.font = { bold: true, size: 14 };
            worksheet.mergeCells(companyRow.number, 1, companyRow.number, 7);

            worksheet.addRow([]);

            for (const course of company.course_details) {
                // Course heading
                const courseRow = worksheet.addRow([`Course: ${course.course_name}`]);
                courseRow.font = { bold: true, size: 12 };
                worksheet.mergeCells(courseRow.number, 1, courseRow.number, 7);

                worksheet.addRow([]);

                for (const batch of course.batch_details) {
                    const batchRow = worksheet.addRow([`Batch: ${batch.batch_name}`]);
                    batchRow.font = { bold: true, size: 11 };
                    worksheet.mergeCells(batchRow.number, 1, batchRow.number, 7);

                    const headerRow = worksheet.addRow([
                        "Candidate Unique ID",
                        "Student Name",
                        "Email",
                        "Phone Number",
                        "Location",
                        "Enrollment Date",
                        "Enrollment Status",
                    ]);
                    headerRow.font = {
                        bold: true,
                        color: { argb: "FFFFFFFF" },
                    };
                    headerRow.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FF4472C4" },
                    };
                    headerRow.alignment = { vertical: "middle", horizontal: "center" };

                    if (batch.batch_enrollment.length === 0) {
                        const noDataRow = worksheet.addRow(["No enrollments found for this batch"]);
                        noDataRow.font = { italic: true };
                        worksheet.mergeCells(noDataRow.number, 1, noDataRow.number, 7);
                    } else {
                        hasData = true;
                        for (const enrollment of batch.batch_enrollment) {
                            const candidate = enrollment.candidates_details;
                            const studentName = [
                                candidate.candidate_first_name,
                                candidate.candidate_last_name,
                            ].filter(Boolean).join(" ");

                            const location = candidate.current_city ?? candidate.permanent_city ?? "N/A";

                            const row = worksheet.addRow([
                                candidate.candidate_unique_id ?? "N/A",
                                studentName,
                                candidate.user_login?.user_email ?? "N/A",
                                candidate.contact_number,
                                location,
                                enrollment.enrollment_date,
                                enrollment.enrollment_status ?? "N/A",
                            ]);

                            row.getCell(6).numFmt = "dd-mm-yyyy";
                            row.alignment = { vertical: "middle" };
                        }
                    }
                    worksheet.addRow([]);
                }
                worksheet.addRow([]);
            }
            worksheet.addRow([]);
        }

        if (!hasData) {
            const noDataRow = worksheet.addRow(["No enrollments found for the selected filters."]);
            noDataRow.font = { italic: true };
            worksheet.mergeCells(noDataRow.number, 1, noDataRow.number, 7);
        }

        // Column widths
        worksheet.getColumn(1).width = 22;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 32;
        worksheet.getColumn(4).width = 18;
        worksheet.getColumn(5).width = 20;
        worksheet.getColumn(6).width = 18;
        worksheet.getColumn(7).width = 22;

        // Filename
        const safeCenterName = centerName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        let filename = `enrollment-report-${safeCenterName}-${fromDate}-to-${toDate}.xlsx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    }
);