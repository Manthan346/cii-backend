import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getInstructorBatches = asyncHandler(
  async (req: InstructorAuthRequest, res: Response) => {
    const companyId = req.instructor?.company_id;

    const search = req.query.search as string | undefined; // matches batch_name OR batch_code
    const courseId = req.query.courseId as string | undefined; // filter by a specific course
    const courseType = req.query.courseType as string | undefined; // online | offline | hybrid
    const status = req.query.status as string | undefined; // UPCOMING | ACTIVE | INACTIVE

    const { skip, limit, page } = req.pagination!;

    // Built as an AND array so search's OR and any future filters don't collide.
    const andConditions: any[] = [
      {
        course_details: {
          company_id: companyId,
        },
      },
    ];

    if (search) {
      andConditions.push({
        OR: [
          { batch_name: { contains: search, mode: "insensitive" } },
          { batch_code: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (courseId) {
      andConditions.push({ course_id: courseId });
    }

    if (courseType) {
      andConditions.push({ course_details: { course_mode: courseType } });
    }

    if (status) {
      andConditions.push({ b_status: status });
    }

    const whereClause = { AND: andConditions };

    const [batches, totalRecords] = await Promise.all([
      prisma.batch_details.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { batch_start_date: "desc" },
        select: {
          batch_id: true,
          batch_name: true,
          batch_code: true,
          batch_start_date: true,
          b_status: true,
          batch_type: true,
          course_details: { select: { course_id: true, course_mode: true, course_name: true } },
          _count: {
            select: {
              batch_enrollment: { where: { enrollment_status: "ACTIVE" } },
            },
          },
        },
      }),
      prisma.batch_details.count({ where: whereClause }),
    ]);

    const data = batches.map((b:any) => ({
      batch_id: b.batch_id,
      batch_name: b.batch_name,
      batch_code: b.batch_code,
      batch_type: b.batch_type,
      course_id: b.course_details?.course_id,
      course_name: b.course_details?.course_name,
      course_type: b.course_details?.course_mode,
      total_candidates_enrolled: b._count.batch_enrollment,
      batch_start_date: b.batch_start_date,
      status: b.b_status,
    }));

    const totalPages = Math.ceil(totalRecords / limit);

    const courses = [
        ...new Map(
            data.map((course: any) => [
                course.course_id,
                {
                    course_id: course.course_id,
                    course_name: course.course_name,
                    course_type: course.course_type,
                },
            ])
        ).values(),
    ];

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          batches: data,
          courses,
          pagination: {
            currentPage: page,
            limit,
            totalRecords,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        "Instructor batches fetched successfully"
      )
    );
  }
);