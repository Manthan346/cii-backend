import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

export const candidateAttendanceSummary = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;
    const courseId = req.query.courseId
      ? req.query.courseId
      : undefined;

    const whereClause: any = {
      candidate_id: candidateId,
    };

    if (courseId) {
      whereClause.attendance_sessions = {
        batch_details: {
          course_id: courseId,

        }
        
      };
    }

    const [totalSessions, attendedSessions, courses] = await Promise.all([
      prisma.attendance_records.count({
        where: whereClause,
      }),

      prisma.attendance_records.count({
        where: {
          ...whereClause,
          attendance_status: {
            in: ["present", "late"],
          },
        },
      }),

      prisma.batch_enrollment.findMany({
        where: {
          candidate_id: candidateId,
        },
        select: {
          batch_details: {
            select: {
              course_details: {
                select: {
                  course_id: true,
                  course_name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const missedSessions = totalSessions - attendedSessions;

    const attendancePercentage =
      totalSessions === 0
        ? 0
        : Number(((attendedSessions / totalSessions) * 100).toFixed(2));

    res.status(200).json(
        new ApiResponse(200, {
            success: true,
      summary: {
        totalSessions,
        attendedSessions,
        missedSessions,
        attendancePercentage,
        
      },
      courses: courses.map((course) => ({
        course_id: course.batch_details.course_details?.course_id,
        course_name: course.batch_details.course_details?.course_name,
      })),

        }, "course details found successfully")
      
    );
  }
);