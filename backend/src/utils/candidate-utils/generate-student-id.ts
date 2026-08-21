import { Prisma } from "../../generated/prisma/client";

/**
 * Builds the candidate unique ID from sequence, center name and date.
 * Format: CENTERNAME-DDMMYY-XXXXXX (e.g., "DELHI-200820-000001")
 *
 * NOTE: sequence is per-center-per-day. Resets to 1 every day for each center.
 *
 * @param sequence - Per-center-per-day sequence number
 * @param centerName - Center name (used as prefix, uppercased)
 * @returns Formatted candidate unique ID
 */
function buildStudentId(sequence: number, centerName: string): string {
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  // 6 digits = up to 999,999 per center per day (practically unbounded)
  return `${centerName}-${dd}${mm}${yy}-${String(sequence).padStart(6, "0")}`;
}

/**
 * Gets the next per-center-per-day sequence number.
 *
 * APPROACH: Count-based with Prisma transaction serialization + retry on conflict.
 *
 * WHY NOT global PostgreSQL SEQUENCE?
 *  - Global sequence never resets. We need per-center-per-day reset to 1.
 *
 * WHY NOT a new counter table?
 *  - User doesn't want a new table.
 *
 * HOW IT WORKS:
 *  1. Build the date-based prefix for today (UTC): e.g., "DELHI-200820"
 *  2. Count existing candidates whose unique_id starts with that prefix.
 *  3. Return count + 1 → next sequence number for that center for that day.
 *
 * CONCURRENCY SAFETY:
 *  - This must run INSIDE a Prisma $transaction.
 *  - On a race condition (two requests get same count → same ID), the first
 *    INSERT wins; the second hits a unique-constraint violation (P2002).
 *  - Callers should catch P2002 and retry the whole transaction a few times.
 *
 * PER-CENTER & PER-DAY ISOLATION:
 *  - The prefix is built from centerName + today's date.
 *  - Different center → different prefix → independent counter (both start at 1).
 *  - Different day → different prefix → counter resets to 1 automatically.
 *
 * @param tx - Prisma transaction client (MUST be inside $transaction)
 * @param centerName - Center name (used as prefix)
 * @returns Next per-center-per-day sequence number (1, 2, 3, ...)
 */
async function getNextSequence(
  tx: Prisma.TransactionClient,
  centerName: string
): Promise<number> {
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  const datePart = `${dd}${mm}${yy}`;

  // Prefix unique to this center + this day. Counting on this prefix gives us
  // "how many candidates were already created in THIS center TODAY".
  const prefix = `${centerName}-${datePart}-`;

  const todayCount = await tx.candidates_details.count({
    where: {
      candidate_unique_id: { startsWith: prefix },
    },
  });

  return todayCount + 1;
}

export { buildStudentId, getNextSequence };
