import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import ExcelJS from "exceljs";

const downloadEnrollmentReport = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;
  const { from_month, from_year, to_month, to_year, course_id } = req.query;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Parse and validate date range
  const fromMonth = parseInt(from_month as string);
  const fromYear = parseInt(from_year as string);
  const toMonth = parseInt(to_month as string);
  const toYear = parseInt(to_year as string);

  if (!fromMonth || !fromYear || !toMonth || !toYear) {
    throw new ApiError(400, "from_month, from_year, to_month, to_year are required");
  }

  if (fromMonth < 1 || fromMonth > 12 || toMonth < 1 || toMonth > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  // Validate date range (from <= to)
  const fromDate = new Date(Date.UTC(fromYear, fromMonth - 1, 1));
  const toDate = new Date(Date.UTC(toYear, toMonth, 0, 23, 59, 59, 999)); // End of to_month

  if (fromDate > toDate) {
    throw new ApiError(400, "From date must be before or equal to to date");
  }

  // Get center's company IDs
  const centerCompanies = await prisma.center_company.findMany({
    where: { center_id: centerId },
    select: { company_id: true },
  });
  const centerCompanyIds = centerCompanies.map(c => c.company_id);

  if (centerCompanyIds.length === 0) {
    throw new ApiError(404, "No companies associated with this center");
  }

  // Build enrollment where clause
  const enrollmentWhere: any = {
    batch_details: {
      center_id: centerId,
      course_details: {
        company_id: { in: centerCompanyIds }, // courses belong to center's companies
      },
    },
    enrollment_date: {
      gte: fromDate,
      lte: toDate,
    },
  };

  if (course_id) {
    enrollmentWhere.batch_details.course_id = course_id;
  }

  // Fetch enrollments with course info
  const enrollments = await prisma.batch_enrollment.findMany({
    where: enrollmentWhere,
    select: {
      enrollment_date: true,
      batch_details: {
        select: {
          course_id: true,
          course_details: { select: { course_name: true } },
        },
      },
    },
    orderBy: { enrollment_date: 'asc' },
  });

  // Group by month-year and course
  const monthlyData = new Map<string, Map<string, { course_name: string; count: number }>>();

  for (const e of enrollments) {
    const date = new Date(e.enrollment_date);
    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    const courseId = e.batch_details.course_id;
    const courseName = e.batch_details.course_details.course_name;

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, new Map());
    }
    const courseMap = monthlyData.get(monthKey)!;
    const existing = courseMap.get(courseId) || { course_name: courseName, count: 0 };
    existing.count++;
    courseMap.set(courseId, existing);
  }

  // Generate all months in range for consistent columns
  const months: string[] = [];
  let current = new Date(fromDate);
  while (current <= toDate) {
    const key = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}`;
    months.push(key);
    current = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1));
  }

  // Collect all unique courses
  const allCourses = new Map<string, string>(); // course_id -> course_name
  for (const courseMap of monthlyData.values()) {
    for (const [courseId, info] of courseMap.entries()) {
      allCourses.set(courseId, info.course_name);
    }
  }

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Enrollment Report");

  // Title row
  const title = course_id
    ? `Monthly Enrollment Report - Single Course`
    : `Monthly Enrollment Report - All Courses`;
  worksheet.addRow([title]);
  worksheet.addRow([`Period: ${fromMonth}/${fromYear} to ${toMonth}/${toYear}`]);
  worksheet.addRow([]); // Empty row

  // Headers
  const headers = ["Course", ...months.map(m => {
    const [y, mo] = m.split('-');
    return `${mo}/${y}`;
  }), "Total"];
  worksheet.addRow(headers);

  // Style headers
  const headerRow = worksheet.getRow(4);
  headerRow.font = { bold: true };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Data rows
  if (allCourses.size === 0) {
    worksheet.addRow(["No data found for the selected filters"]);
  } else {
    for (const [courseId, courseName] of allCourses.entries()) {
      const rowData: (string | number)[] = [courseName];
      let courseTotal = 0;

      for (const monthKey of months) {
        const count = monthlyData.get(monthKey)?.get(courseId)?.count || 0;
        rowData.push(count);
        courseTotal += count;
      }
      rowData.push(courseTotal);
      worksheet.addRow(rowData);
    }

    // Grand total row
    const totalRow: (string | number)[] = ["Grand Total"];
    let grandTotal = 0;
    for (const monthKey of months) {
      let monthTotal = 0;
      for (const [, info] of (monthlyData.get(monthKey) || new Map()).entries()) {
        monthTotal += info.count;
      }
      totalRow.push(monthTotal);
      grandTotal += monthTotal;
    }
    totalRow.push(grandTotal);
    const totalRowObj = worksheet.addRow(totalRow);
    totalRowObj.font = { bold: true };
    totalRowObj.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } };
  }

  // Auto-fit columns
  worksheet.columns.forEach((col, i) => {
    col.width = i === 0 ? 30 : 15;
  });

  // Set response headers for file download
  const filename = `enrollment-report-${fromYear}${String(fromMonth).padStart(2, '0')}-to-${toYear}${String(toMonth).padStart(2, '0')}${course_id ? `-${course_id}` : ''}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
  res.end();
});

export { downloadEnrollmentReport };