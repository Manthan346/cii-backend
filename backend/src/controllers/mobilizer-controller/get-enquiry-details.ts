import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { formatEnquiryDate, formatHistoryDate, formatHistoryTime } from "../../utils/dateFormatter";

export const getEnquiryDetails = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const enquiryId  = req.params.enquiryId as string;
        const centerId = req.mobilizer?.center_id;

        if (!enquiryId) {
            throw new ApiError(400, "Enquiry ID is required");
        }

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        // Scope by center: use findFirst with both enquiry_id AND center_id so an
        // enquiry that exists but belongs to another center returns null -> 404.
        const enquiry = await prisma.enquiry_records.findFirst({
            where: { enquiry_id: enquiryId, center_id: centerId },
            select: {
                enquiry_id: true,
                enquiry_first_name: true,
                enquiry_last_name: true,
                enquiry_email: true,
                enquiry_phone_no: true,
                enquiry_education: true,
                enquiry_location: true,
                enquiry_source: true,
                remarks: true,
                enq_status: true,
                created_at: true,
                updated_at: true,
                mobilizer_id: true,
                center_id: true,
                course_id: true,
                mobilizer_details: {
                    select: {
                        mobilizer_id: true,
                        mobilizer_first_name: true,
                        mobilizer_last_name: true,
                        mobilizer_unique_id: true
                    }
                },
                center_details: {
                    select: {
                        center_id: true,
                        center_name: true
                    }
                },
                course_details: {
                    select: {
                        course_id: true,
                        course_name: true
                    }
                },
                enquiry_status_history: {
                    orderBy: { created_at: "desc" },
                    select: {
                        history_id: true,
                        enq_status: true,
                        mobilizer_id: true,
                        created_at: true,
                        mobilizer_details: {
                            select: {
                                mobilizer_first_name: true,
                                mobilizer_last_name: true
                            }
                        }
                    }
                }
            }
        });

        if (!enquiry) {
            throw new ApiError(404, "Enquiry not found");
        }

        const fullName = `${enquiry.enquiry_first_name} ${enquiry.enquiry_last_name ?? ""}`.trim();
        const initials = `${enquiry.enquiry_first_name[0]}${enquiry.enquiry_last_name?.[0] ?? ""}`.toUpperCase();

        const statusHistoryRaw = enquiry.enquiry_status_history.map((h) => ({
            status: h.enq_status,
            date: h.created_at,
            updateByMobilizer: h.mobilizer_details
                ? `${h.mobilizer_details.mobilizer_first_name} ${h.mobilizer_details.mobilizer_last_name}`.trim()
                : "Unknown",
            location: enquiry.enquiry_location ?? enquiry.center_details?.center_name ?? "N/A",
        }));

        const responseData = {
            candidate_profile: {
                name: fullName,
                initials,
                verification_status: enquiry.enq_status ?? "Pending",
                education: enquiry.enquiry_education ?? "Not specified",
                enquiry_date: formatEnquiryDate(enquiry.created_at)
            },
            contact_details: {
                phone: enquiry.enquiry_phone_no,
                email: enquiry.enquiry_email
            },
            status_history: statusHistoryRaw.map((h) => ({
                status: h.status,
                date: formatHistoryDate(h.date),
                time: formatHistoryTime(h.date),
                updateByMobilizer: h.updateByMobilizer,
                 
                    
                location: enquiry.enquiry_location ?? enquiry.center_details?.center_name ?? "N/A",
            }))
        };

        return res.status(200).json(
            new ApiResponse(200, responseData, "Enquiry details fetched successfully")
        );
    }
);