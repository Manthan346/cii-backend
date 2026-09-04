import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiError } from "../../helpers/ApiError";

import ExcelJS from "exceljs";

const downloadCompanyEnrollmentReport = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {

        const centerId = req.user.center_id;

        const {
            company_id,
            course_id,
            batch_id,
            from_date,
            to_date,
        } = req.query;


        if (!centerId) {
            throw new ApiError(404, "Center ID not found in token");
        }

        if (!company_id) {
            throw new ApiError(400, "company_id is required");
        }

        if (Array.isArray(company_id)) {
            throw new ApiError(400, "company_id must be a single value");
        }

        if (Array.isArray(course_id)) {
            throw new ApiError(400, "course_id must be a single value");
        }

        if (Array.isArray(batch_id)) {
            throw new ApiError(400, "batch_id must be a single value");
        }

        if (Array.isArray(from_date)) {
            throw new ApiError(400, "from_date must be a single value");
        }

        if (Array.isArray(to_date)) {
            throw new ApiError(400, "to_date must be a single value");
        }

        const companyId = company_id as string;
        const courseId = course_id as string | undefined;
        const batchId = batch_id as string | undefined;

        const fromDate = from_date as string | undefined;
        const toDate = to_date as string | undefined;

        if (batchId && !courseId) {
            throw new ApiError(
                400,
                "course_id is required when batch_id is provided"
            );
        }

        if ((fromDate && !toDate) || (!fromDate && toDate)) {
            throw new ApiError(
                400,
                "Both from_date and to_date are required when using date filter"
            );
        }

        let enrollmentFromDate: Date | undefined;
        let enrollmentToDate: Date | undefined;

        if (fromDate && toDate) {

            // Validate YYYY-MM-DD format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (
                !dateRegex.test(fromDate) ||
                !dateRegex.test(toDate)
            ) {
                throw new ApiError(
                    400,
                    "Invalid date format. Use YYYY-MM-DD"
                );
            }

            enrollmentFromDate = new Date(
                `${fromDate}T00:00:00.000Z`
            );

            enrollmentToDate = new Date(
                `${toDate}T23:59:59.999Z`
            );

            if (
                isNaN(enrollmentFromDate.getTime()) ||
                isNaN(enrollmentToDate.getTime())
            ) {
                throw new ApiError(
                    400,
                    "Invalid from_date or to_date"
                );
            }

            if (enrollmentFromDate > enrollmentToDate) {
                throw new ApiError(
                    400,
                    "from_date must be before or equal to to_date"
                );
            }
        }

        const centerCompany = await prisma.center_company.findUnique({
            where: {
                center_id_company_id: {
                    center_id: centerId,
                    company_id: companyId,
                },
            },

            select: {
                company_details: {
                    select: {
                        company_id: true,
                        company_name: true,
                    },
                },
            },
        });

        if (!centerCompany) {
            throw new ApiError(
                404,
                "Company not found or company is not associated with this center"
            );
        }

        const company = centerCompany.company_details;

        const courses = await prisma.course_details.findMany({

            where: {
                company_id: companyId,

                ...(courseId
                    ? {
                          course_id: courseId,
                      }
                    : {}),
            },

            select: {

                course_id: true,

                course_name: true,

                batch_details: {

                    where: batchId
                        ? {
                              batch_id: batchId,
                          }
                        : undefined,

                    select: {

                        batch_id: true,

                        batch_name: true,

                        batch_enrollment: {

                            where:
                                enrollmentFromDate &&
                                enrollmentToDate
                                    ? {
                                          enrollment_date: {
                                              gte: enrollmentFromDate,
                                              lte: enrollmentToDate,
                                          },
                                      }
                                    : undefined,

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

        });

        if (courseId && courses.length === 0) {

            throw new ApiError(
                404,
                "Course not found or course does not belong to this company"
            );

        }

        if (batchId) {

            const batchExists = courses.some(course =>
                course.batch_details.some(
                    batch => batch.batch_id === batchId
                )
            );

            if (!batchExists) {

                throw new ApiError(
                    404,
                    "Batch not found or batch does not belong to the selected course"
                );

            }

        }

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(
            "Enrollment Report"
        );

        const companyRow = worksheet.addRow([
            `Company: ${company.company_name}`,
        ]);

        companyRow.font = {
            bold: true,
            size: 16,
        };

        worksheet.mergeCells(
            companyRow.number,
            1,
            companyRow.number,
            7
        );

        if (fromDate && toDate) {

            const dateRow = worksheet.addRow([
                `Enrollment Period: ${fromDate} to ${toDate}`,
            ]);

            dateRow.font = {
                italic: true,
            };

            worksheet.mergeCells(
                dateRow.number,
                1,
                dateRow.number,
                7
            );

        }

        worksheet.addRow([]);

        for (const course of courses) {

            // Course heading
            const courseRow = worksheet.addRow([
                `Course: ${course.course_name}`,
            ]);

            courseRow.font = {
                bold: true,
                size: 14,
            };

            worksheet.mergeCells(
                courseRow.number,
                1,
                courseRow.number,
                7
            );

            worksheet.addRow([]);

            for (const batch of course.batch_details) {
                const batchRow = worksheet.addRow([
                    `Batch: ${batch.batch_name}`,
                ]);
                batchRow.font = {
                    bold: true,
                    size: 12,
                };
                worksheet.mergeCells(
                    batchRow.number,
                    1,
                    batchRow.number,
                    7
                );
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
                    color: {
                        argb: "FFFFFFFF",
                    },
                };
                headerRow.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "FF4472C4",
                    },
                };
                headerRow.alignment = {
                    vertical: "middle",
                    horizontal: "center",
                };

                if (batch.batch_enrollment.length === 0) {
                    const noDataRow = worksheet.addRow([
                        "No enrollments found for this batch",
                    ]);
                    noDataRow.font = {
                        italic: true,
                    };
                    worksheet.mergeCells(
                        noDataRow.number,
                        1,
                        noDataRow.number,
                        7
                    );
                } else {
                    for (const enrollment of batch.batch_enrollment) {
                        const candidate =
                            enrollment.candidates_details;
                        // Candidate name
                        const studentName = [
                            candidate.candidate_first_name,
                            candidate.candidate_last_name,
                        ]
                            .filter(Boolean)
                            .join(" ");
                        // Current city first,
                        // permanent city as fallback
                        const location =
                            candidate.current_city ??
                            candidate.permanent_city ??
                            "N/A";
                        const row = worksheet.addRow([
                            candidate.candidate_unique_id ??
                                "N/A",
                            studentName,
                            candidate.user_login?.user_email ??
                                "N/A",
                            candidate.contact_number,
                            location,
                            enrollment.enrollment_date,
                            enrollment.enrollment_status ??
                                "N/A",
                        ]);
                        // Enrollment date format
                        row.getCell(6).numFmt =
                            "dd-mm-yyyy";
                        row.alignment = {
                            vertical: "middle",
                        };
                    }
                }
                worksheet.addRow([]);
            }
            worksheet.addRow([]);
        }

        if (courses.length === 0) {
            const noDataRow = worksheet.addRow([
                "No courses found for the selected filters.",
            ]);
            noDataRow.font = {
                italic: true,
            };
            worksheet.mergeCells(
                noDataRow.number,
                1,
                noDataRow.number,
                7
            );
        }

        worksheet.getColumn(1).width = 22;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 32;
        worksheet.getColumn(4).width = 18;
        worksheet.getColumn(5).width = 20;
        worksheet.getColumn(6).width = 18;
        worksheet.getColumn(7).width = 22;

        const safeCompanyName = company.company_name
            .replace(/[^a-zA-Z0-9]/g, "-")
            .toLowerCase();

        let filename =
            `company-enrollment-report-${safeCompanyName}`;

        if (courseId) {
            filename += "-course";
        }

        if (batchId) {
            filename += "-batch";
        }

        if (fromDate && toDate) {
            filename += `-${fromDate}-to-${toDate}`;
        }

        filename += ".xlsx";


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        await workbook.xlsx.write(res);
        res.end();
    }
);

export {
    downloadCompanyEnrollmentReport,
};