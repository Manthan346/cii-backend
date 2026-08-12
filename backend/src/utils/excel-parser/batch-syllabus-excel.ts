import ExcelJS from "exceljs";
import { ApiError } from "../../helpers/ApiError";

const REQUIRED_HEADERS = ["topic_name", "completion_date"];

export type RawSyllabusRow = {
    rowNumber: number;
    topic_name: string;
    completion_date: Date;
};

export async function parseSyllabusExcelBuffer(
    buffer: Buffer
): Promise<RawSyllabusRow[]> {

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

    // Check required columns
    const missingHeaders = REQUIRED_HEADERS.filter(
        (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
        throw new ApiError(
            400,
            `Missing required column(s): ${missingHeaders.join(", ")}`
        );
    }

    // Convert:
    // {
    //   1: "topic_name",
    //   2: "completion_date"
    // }
    //
    // into:
    // {
    //   topic_name: 1,
    //   completion_date: 2
    // }

    const columnIndex: Record<string, number> = {};

    headers.forEach((header, index) => {
        if (header) {
            columnIndex[header] = index;
        }
    });

    const rows: RawSyllabusRow[] = [];

    worksheet.eachRow((row, rowNumber) => {

        // Skip header
        if (rowNumber === 1) {
            return;
        }

        // Skip completely empty rows
        if (row.actualCellCount === 0) {
            return;
        }

        const topicCell = row.getCell(columnIndex["topic_name"]);
        const completionDateCell =
            row.getCell(columnIndex["completion_date"]);

        const topicName = String(topicCell.value ?? "").trim();

        const completionDate = completionDateCell.value;

        // Validate topic name
        if (!topicName) {
            throw new ApiError(
                400,
                `Topic name is missing at Excel row ${rowNumber}`
            );
        }

        // ExcelJS normally gives us a Date when the Excel
        // cell contains an actual Excel date.
        if (!(completionDate instanceof Date)) {
            throw new ApiError(
                400,
                `Invalid completion date at Excel row ${rowNumber}`
            );
        }

        rows.push({
            rowNumber,
            topic_name: topicName,
            completion_date: completionDate,
        });
    });

    if (rows.length === 0) {
        throw new ApiError(400, "No data rows found in the uploaded file");
    }

    return rows;
}