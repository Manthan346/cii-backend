import ExcelJS from "exceljs";
import { ApiError } from "../../helpers/ApiError";

// All fields are optional - no required headers
const OPTIONAL_HEADERS = [
  "candidate_name",
  "contact_no",
  "location",
  "qualification",
  "college_institute",
  "age",
  "gender",
  "candidate_experience",
  "area",
  "ward_no",
  "vidhansabha",
  "company_name",
  "candidate_application_status",
];

export type RawJobFairCandidateRow = {
  rowNumber: number;
  candidate_name?: string;
  contact_no?: string;
  location?: string;
  qualification?: string;
  college_institute?: string;
  age?: number;
  gender?: string;
  candidate_experience?: string;
  area?: string;
  ward_no?: string;
  vidhansabha?: string;
  company_name?: string;
  candidate_application_status?: string;
};

export async function parseJobFairCandidatesExcelBuffer(
  buffer: Buffer
): Promise<RawJobFairCandidateRow[]> {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new ApiError(400, "Uploaded file has no worksheet");
  }

  // Read the first row as Excel headers
  const headerRow = worksheet.getRow(1);

  const headers: string[] = [];

  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value)
      .trim()
      .toLowerCase();
  });

  // Map header name -> column index
  const colIndex: Record<string, number> = {};

  headers.forEach((header, index) => {
    if (header) {
      colIndex[header] = index;
    }
  });

  const rows: RawJobFairCandidateRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    // Skip header
    if (rowNumber === 1) {
      return;
    }

    // Skip completely empty rows
    if (row.actualCellCount === 0) {
      return;
    }

    const getCell = (key: string): string | undefined => {
      const idx = colIndex[key];
      if (!idx) return undefined;

      const value = row.getCell(idx).value;

      if (value == null) return undefined;

      // Handle Date objects (unlikely for these fields, but just in case)
      if (value instanceof Date) {
        return value.toISOString().split("T")[0];
      }

      return String(value).trim();
    };

    const ageCell = getCell("age");
    const age = ageCell ? parseInt(ageCell, 10) : undefined;

    rows.push({
      rowNumber,
      candidate_name: getCell("candidate_name"),
      contact_no: getCell("contact_no"),
      location: getCell("location"),
      qualification: getCell("qualification"),
      college_institute: getCell("college_institute"),
      age: Number.isNaN(age) ? undefined : age,
      gender: getCell("gender"),
      candidate_experience: getCell("candidate_experience"),
      area: getCell("area"),
      ward_no: getCell("ward_no"),
      vidhansabha: getCell("vidhansabha"),
      company_name: getCell("company_name"),
      candidate_application_status: getCell("candidate_application"),
    });
  });

  if (rows.length === 0) {
    throw new ApiError(400, "No data rows found in the uploaded file");
  }

  return rows;
}