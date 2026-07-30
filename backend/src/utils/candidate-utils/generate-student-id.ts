
import { Prisma } from "../../generated/prisma/client";


function buildStudentId(sequence: number, centerName: string): string {
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  return `${centerName}-${dd}${mm}${yy}-${String(sequence).padStart(4, "0")}`;
}

async function getNextSequenceGuess(tx: Prisma.TransactionClient): Promise<number> {
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  const datePart = `${dd}${mm}${yy}`;

  const todayCount = await tx.candidates_details.count({
    where: { candidate_unique_id: { contains: datePart } },
  });

  return todayCount + 1;
}

export { buildStudentId, getNextSequenceGuess };