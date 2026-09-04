import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { buildStudentId, getNextSequence } from "../../utils/candidate-utils/generate-student-id";
import * as bcrypt from "bcrypt";

/**
 * Admin create candidate — admin can create and enroll a candidate in a batch.
 *
 * Flow:
 * 1. Validate admin has center_id from token
 * 2. Check if candidate with contact_number already exists in user_login
 * 3. Fetch center name for student ID generation
 * 4. Generate unique candidate ID using utility
 * 5. Generate default password: firstname + lastname + last 4 digits of phone
 * 6. Hash password
 * 7. Create user_login record (candidate role, center_id from admin)
 * 8. Create candidates_details record with generated candidate_unique_id
 * 9. Enroll candidate in batch (center-scoped validation)
 * 10. Return enrollment details with generated credentials
 *
 * All operations in a transaction for atomicity.
 * Center isolation enforced throughout.
 */
export const adminCreateCandidate = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {
        const adminId = req.user?.user_id;
        const centerId = req.user?.center_id;

        if (!adminId || !centerId) {
            throw new ApiError(401, "Admin not authenticated or center not assigned");
        }

        const {
            // Candidate details
            first_name,
            last_name,
            contact_number,
            email,
            gender,
            date_of_birth,
            blood_group,
            // Course and batch
            course_id,
            batch_id,
            enrollment_date,
        } = req.body;

        // Verify center exists and get center name for student ID
        const center = await prisma.center_details.findUnique({
            where: { center_id: centerId },
            select: { center_name: true }
        });

        if (!center) {
            throw new ApiError(404, "Center not found");
        }

        // Use transaction for atomicity.
        // Retry a few times on unique-constraint violation (P2002): with the
        // per-center-per-day count-based sequence, two concurrent enrollments
        // can compute the same candidate_unique_id. The winner commits; the
        // loser re-runs the whole transaction, recomputes the sequence (now +1),
        // and succeeds.
        const MAX_RETRIES = 5;
        let result: any;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                result = await prisma.$transaction(async (tx) => {
            // Check if candidate already exists with this contact number
            // Check if candidate already exists with this contact number in candidates_details
            const existingCandidate = await tx.candidates_details.findFirst({
                where: {
                    contact_number: contact_number,

                },
                include: {
                    user_login: true
                }
            });

            const existingUser = existingCandidate?.user_login;

            let candidateUserId: string;
            let candidateId: string;
            let candidateUniqueId: string;
            let generatedPassword: string;
            let userEmail: string;
            let isNewCandidate = false;

            if (existingUser) {
                // Candidate already has a user_login, check if they have candidate details
                candidateUserId = existingUser.user_id;
                if (!existingCandidate) {
                    throw new ApiError(400, "User exists but candidate profile incomplete. Contact admin.");
                }
                candidateId = existingCandidate.candidate_id;
                candidateUniqueId = existingCandidate.candidate_unique_id || "";
                // Don't regenerate password for existing candidates
                generatedPassword = "";
                userEmail = existingUser.user_email;  // Use existing email
                isNewCandidate = false;
            } else {
                // NEW CANDIDATE - Create everything
                isNewCandidate = true;

                // Generate sequence and candidate_unique_id
                // Use first 3 letters of center name (uppercased) as prefix
                const centerPrefix = center.center_name.toUpperCase().slice(0, 3);
                const sequence = await getNextSequence(tx, centerPrefix);
                candidateUniqueId = buildStudentId(sequence, centerPrefix);

                // Generate default password: firstname + lastname + last 4 digits of phone
                const cleanLastName = last_name?.trim() || "";
                const last4Digits = contact_number.slice(-4);
                generatedPassword = `${first_name.trim()}${cleanLastName}${last4Digits}`.replace(/\s+/g, '').toLowerCase();

                // Hash password
                const hashedPassword = await bcrypt.hash(generatedPassword, 10);

                // Create user_login
                // Email is required (validated by schema)
                userEmail = email.trim();

                const userLogin = await tx.user_login.create({
                    data: {
                        user_email: userEmail,
                        user_password: hashedPassword,
                        user_role: "candidate",
                        center_id: centerId,
                        is_active: true
                    }
                });
                candidateUserId = userLogin.user_id;

                // Create candidates_details
                const candidate = await tx.candidates_details.create({
                    data: {
                        user_id: candidateUserId,
                        candidate_first_name: first_name.trim(),
                        candidate_last_name: last_name?.trim() || null,
                        contact_number,
                        gender: gender?.trim() || null,
                        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
                        blood_group: blood_group?.trim() || null,
                        candidate_unique_id: candidateUniqueId,
                         // Requires admin approval
                    }
                });
                candidateId = candidate.candidate_id;
            }

            // Verify batch exists and belongs to the same center
            const batch = await tx.batch_details.findUnique({
                where: { batch_id },
                select: { center_id: true, max_candidates: true, b_status: true, course_id: true,  }
            });

            if (!batch) {
                throw new ApiError(404, "Batch not found");
            }

            if (batch.center_id !== centerId) {
                throw new ApiError(403, "Batch does not belong to your center");
            }

            if (batch.b_status !== 'ACTIVE') {
                throw new ApiError(400, "Batch is not active");
            }

            // Verify course matches batch
            if (batch.course_id !== course_id) {
                throw new ApiError(400, "Batch does not belong to the selected course");
            }

            // Check capacity
            const activeCount = await tx.batch_enrollment.count({
                where: {
                    batch_id,
                    enrollment_status: 'ACTIVE'
                }
            });

            if (activeCount >= batch.max_candidates) {
                throw new ApiError(400, "Batch has reached maximum capacity");
            }

            // Check existing enrollment
            const existingEnrollment = await tx.batch_enrollment.findUnique({
                where: {
                    candidate_batch_id: `${candidateId}-${batch_id}`
                }
            });

            if (existingEnrollment) {
                throw new ApiError(409, "Candidate already enrolled in this batch");
            }

            // Create enrollment
            const enrollment = await tx.batch_enrollment.create({
                data: {
                    candidate_id: candidateId,
                    batch_id,
                    enrollment_status: 'ACTIVE',
                    enrollment_date: enrollment_date ? new Date(enrollment_date) : new Date(),

                }
            });

            return {
                enrollment,
                candidateId,
                candidateUniqueId,
                candidateUserId,
                generatedPassword: isNewCandidate ? generatedPassword : null,
                userEmail: isNewCandidate ? userEmail : null,
                isNewCandidate
            };
        });
                break; // success → exit retry loop
            } catch (error: any) {
                // P2002 = unique-constraint violation (duplicate candidate_unique_id race)
                if (error?.code === "P2002" && attempt < MAX_RETRIES - 1) {
                    continue; // retry whole transaction → recomputes sequence
                }
                // Non-retryable, or last attempt failed → bubble up
                throw error;
            }
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    enrollment: {
                        enrollment_id: result.enrollment.enrollment_id,
                        enrollment_status: result.enrollment.enrollment_status,
                        enrollment_date: result.enrollment.enrollment_date,
                    },
                    candidate: {
                        candidate_id: result.candidateId,
                        candidate_unique_id: result.candidateUniqueId,
                        first_name: first_name.trim(),
                        last_name: last_name?.trim() || "",
                        contact_number,
                    },

                    batch: {
                        batch_id,
                    },
                    // Only return generated password for NEW candidates
                    ...(result.isNewCandidate && {
                        credentials: {
                            login_email: result.userEmail,
                            default_password: result.generatedPassword,
                            // note: "Share these credentials with the candidate. Password = firstname + lastname + last 4 digits of phone"
                        }
                    })
                },
                result.isNewCandidate
                    ? "Candidate created and enrolled successfully"
                    : "Existing candidate enrolled successfully"
            )
        );
    }
);