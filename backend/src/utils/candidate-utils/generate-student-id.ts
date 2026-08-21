import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

/**
 * Builds the candidate unique ID from sequence and center name.
 * Format: CENTERNAME-DDMMYY-XXXX (e.g., "DELHI-200826-0042")
 *
 * @param sequence - Atomic sequence number from PostgreSQL sequence
 * @param centerName - Center name (used as prefix)
 * @returns Formatted candidate unique ID
 */
function buildStudentId(sequence: number, centerName: string): string {
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(now.getUTCFullYear()).slice(-2);
  return `${centerName}-${dd}${mm}${yy}-${String(sequence).padStart(4, "0")}`;
}

/**
 * Gets the next sequence number using PostgreSQL SEQUENCE.
 *
 * WHY POSTGRESQL SEQUENCE?
 * ========================
 * - Atomic: Single CPU instruction (nextval), no race condition possible
 * - No locks: Unlike pessimistic locking, doesn't block other transactions
 * - No retries: Unlike optimistic locking, never conflicts
 * - Crash-safe: Persists across transactions, survives restarts
 * - High performance: No application-level coordination needed
 *
 * HOW IT WORKS:
 * =============
 * 1. Database maintains a persistent counter (SEQUENCE object)
 * 2. nextval() atomically increments and returns new value
 * 3. Even if transaction rolls back, sequence number is consumed (gaps allowed)
 * 4. Multiple concurrent calls get unique values automatically
 *
 * MIGRATION REQUIRED (run once):
 * ==============================
 * CREATE SEQUENCE candidate_unique_id_seq START 1;
 *
 * @param tx - Prisma transaction client
 * @returns Next sequence number (1, 2, 3, ...)
 */
async function getNextSequence(tx: Prisma.TransactionClient): Promise<number> {
  // Raw SQL to call PostgreSQL nextval() - atomic operation
  const result = await tx.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('candidate_unique_id_seq') as nextval
  `;

  // PostgreSQL returns bigint, convert to number
  return Number(result[0].nextval);
}

/**
 * Initialize the PostgreSQL sequence if not exists.
 * Call this once at application startup (e.g., in index.ts) or run as migration.
 * Safe to call multiple times - CREATE SEQUENCE IF NOT EXISTS logic.
 */
export async function initializeCandidateSequence(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'candidate_unique_id_seq') THEN
        CREATE SEQUENCE candidate_unique_id_seq START 1;
      END IF;
    END
    $$;
  `);
}

export { buildStudentId, getNextSequence };