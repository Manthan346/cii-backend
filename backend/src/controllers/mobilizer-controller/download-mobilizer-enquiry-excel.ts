import { Response, Request } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import ExcelJS from "exceljs";

export const downloadMobilizerEnquiryExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const mobilizerReq = req as MobilizerAuthRequest;
    const mobilizerId = mobilizerReq.mobilizer?.mobilizer_id;
    const centerId = mobilizerReq.mobilizer?.center_id;

    if (!mobilizerId || !centerId) {
      throw new ApiError(401, "Mobilizer not authenticated or center not assigned");
    }

    // Parse query parameters for filtering
    const { from_date, to_date, course_id, company_id, enquiry_status } = req.query;

    // Build where clause for enquiry records
    const whereClause: any = {
      // mobilizer_id: mobilizerId, // Enquiries assigned to this mobilizer
    };

    // Date range filter
    if (from_date || to_date) {
      whereClause.created_at = {};
      if (from_date) {
        whereClause.created_at.gte = new Date(from_date as string);
      }
      if (to_date) {
        // Set to end of day for to_date
        const toDate = new Date(to_date as string);
        toDate.setHours(23, 59, 59, 999);
        whereClause.created_at.lte = toDate;
      }
    }

    // Course filter
    if (course_id) {
      whereClause.course_id = course_id as string;
    }

    // Company filter (via course_details.company_id)
    if (company_id) {
      whereClause.course_details = {
        company_id: company_id as string
      };
    }

    // Enquiry status filter
    if (enquiry_status) {
      whereClause.enq_status = enquiry_status as string;
    }

    // Fetch enquiry records with related course and company details
    const enquiries = await prisma.enquiry_records.findMany({
      where: whereClause,
      select: {
        enquiry_id: true,
        enquiry_first_name: true,
        enquiry_last_name: true,
        enquiry_phone_no: true,
        enquiry_email: true,
        enquiry_education: true,
        enquiry_location: true,
        created_at: true,
        updated_at: true,
        enq_status: true,
        course_details: {
          select: {
            course_name: true,
            course_id: true,
            company_details: {
              select: {
                company_name: true,
                company_id: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    });

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Enquiries');

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Contact Number', key: 'contactNumber', width: 15 },
      { header: 'Email', key: 'email', width: 20 },
      
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Company', key: 'company', width: 20 },
      { header: 'Enquiry Status', key: 'enquiryStatus', width: 15 },
      { header: 'date', key: 'date', width: 15 },
     
    ];

    // Add rows with data
    enquiries.forEach(enquiry => {
      const name = `${enquiry.enquiry_first_name?.trim() || ''} ${enquiry.enquiry_last_name?.trim() || ''}`.trim() || 'N/A';

      worksheet.addRow({
        name: name,
        contactNumber: enquiry.enquiry_phone_no || 'N/A',
        email: enquiry.enquiry_email || 'N/A',
       
        course: enquiry.course_details?.course_name || 'N/A',
        company: enquiry.course_details?.company_details?.company_name || 'N/A',
        enquiryStatus: enquiry.enq_status || 'N/A',
        date: enquiry.created_at.toISOString().split('T')[0], // YYYY-MM-DD
        
      });
    });

    // Set header row style
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for Excel download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=mobilizer_enquiries_${new Date().toISOString().slice(0,10)}.xlsx`
    );

    return res.status(200).send(buffer);
  }
);