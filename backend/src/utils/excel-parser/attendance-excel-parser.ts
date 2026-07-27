import ExcelJS from "exceljs";
import { ApiError } from "../../helpers/ApiError";

const REQUIRED_HEADERS = ["batch_code", "session_date", "attendance_mode"]

export type RawExcelRow = {
  rowNumber: number;

  batch_code: string
  session_date:Date | string;
  attendance_mode: string;
  session_time?: string;
  room_no?: string;
  topic_name?: string;
};

export async function parseAttendanceExcelBuffer(buffer: Buffer): Promise<RawExcelRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new ApiError(400, "Uploaded file has no worksheet");
  }

  // headers: column position -> header name found there
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value).trim().toLowerCase();
  });

  const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new ApiError(400, `Missing required column(s): ${missingHeaders.join(", ")}`);
  }

  // colIndex: header name -> column position (inverse of headers) — lets
  // the code find a field by name regardless of column order in the sheet
  const colIndex: Record<string, number> = {};
  headers.forEach((h, idx) => {
    if (h) colIndex[h] = idx;
  });

  const rows: RawExcelRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    if (row.actualCellCount === 0) return;

const getCell = (key: string) => {
  const idx = colIndex[key];
  if (!idx) return undefined;

  const value = row.getCell(idx).value;

  if (value == null) return undefined;

  if (value instanceof Date) {
    if (key === "session_date") {
      return value; // Return the Date object directly
    }
const cell = row.getCell(idx);

    if (key === "session_time") {

        
const hh = String(value.getUTCHours()).padStart(2, "0");
const mm = String(value.getUTCMinutes()).padStart(2, "0");
        console.log("================================== new ==============================");
  console.log("cell.value:", cell.value);
  console.log("cell.text:", cell.text);
  console.log("cell.type:", cell.type);
  console.log("cell.numFmt:", cell.numFmt);
      return `${hh}:${mm}`;
      
      
    }
  }

  return String(value).trim();
};

rows.push({
  rowNumber,
  batch_code: (getCell("batch_code") as string) ?? "",
  session_date: getCell("session_date") ?? "",
  attendance_mode: ((getCell("attendance_mode") as string) ?? "").toLowerCase(),
  session_time: getCell("session_time") as string | undefined,
  room_no: getCell("room_no") as string | undefined,
  topic_name: getCell("topic_name") as string | undefined,
});
  });

  if (rows.length === 0) {
    throw new ApiError(400, "No data rows found in the uploaded file");
  }

  return rows;
}