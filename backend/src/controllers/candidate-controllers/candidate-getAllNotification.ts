import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";


//creating categories as per the db enums for notifications
const CATEGORY_MAP: Record<string, string[]> = {
  job: ["JOB_OPPORTUNITY", "RECRUITER_RESPONSE", "INTERVIEW_SCHEDULED"],
  academics: ["ACADEMIC", "ASSESSMENT_CREATED", "STUDY_MATERIAL_UPLOADED", "BATCH_ASSIGNED", "ATTENDANCE_CREATED", "CERTIFICATE_UPLOADED"],
  examination: ["EXAMINATION", "RESULT_PUBLISHED"],
};
const VALID_CATEGORIES = ["all", "job", "academics", "examination"];

function getDateBucketBoundaries() {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setUTCDate(todayStart.getUTCDate() - 1);
  return { todayStart, yesterdayStart };
}

function bucketByDate<T extends { created_at: Date | null }>(items: T[]) {
  const { todayStart, yesterdayStart } = getDateBucketBoundaries();
  const buckets: { today: T[]; yesterday: T[]; older: T[] } = { today: [], yesterday: [], older: [] };

  for (const item of items) {
    if (!item.created_at) {
      buckets.older.push(item);
      continue;
    }
    if (item.created_at >= todayStart) buckets.today.push(item);
    else if (item.created_at >= yesterdayStart) buckets.yesterday.push(item);
    else buckets.older.push(item);
  }
  return buckets;
}

export const getCandidateNotifications = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const userId = req.user.user_id;

    const category = (req.query.category as string | undefined) ?? "all";
    const cursor = req.query.cursor as string | undefined;
    

    let limit = req.query.limit ? Number(req.query.limit) : 20;
    if (!Number.isFinite(limit) || limit <= 0) limit = 20;
    if (limit > 20 || limit < 20) limit = 20;

    if (!VALID_CATEGORIES.includes(category)) {
      throw new ApiError(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
    }

    const andConditions: any[] = [{ user_id: userId }];
    if (category !== "all") {
      andConditions.push({ notifications: { notification_type: { in: CATEGORY_MAP[category] } } });
    }
    const whereClause = { AND: andConditions };

    const userNotifications = await prisma.user_notifications.findMany({
      where: whereClause,
      take: limit + 1,
      ...(cursor && { cursor: { user_notification_id: cursor }, skip: 1 }),
      orderBy: { created_at: "desc" },
      select: {
        user_notification_id: true,
        is_read: true,
        read_at: true,
        created_at: true,
        notifications: {
          select: {
            notification_id: true,
            title: true,
            notification_message: true,
            notification_type: true,
            reference_type: true,
            reference_id: true,
          },
        },
      },
    });

    const hasNextPage = userNotifications.length > limit;
    const pageItems = hasNextPage ? userNotifications.slice(0, limit) : userNotifications;
    const nextCursor = hasNextPage ? pageItems[pageItems.length - 1].user_notification_id : null;

    // Capture original read state BEFORE mutating — the response should
    // reflect what was true when the user opened this list, not what
    // becomes true a moment later once we mark them read below.
    const flattened = pageItems.map((un) => ({
      user_notification_id: un.user_notification_id,
      notification_id: un.notifications.notification_id,
      title: un.notifications.title,
      message: un.notifications.notification_message,
      notification_type: un.notifications.notification_type,
      reference_type: un.notifications.reference_type,
      reference_id: un.notifications.reference_id,
      is_read: un.is_read, // pre-mutation value — "was this unread when opened?"
      read_at: un.read_at,
      created_at: un.created_at,
    }));

    const { today, yesterday, older } = bucketByDate(flattened);

    // Side effect: mark every unread notification returned in this page
    // as read, since the user is now viewing the notification section.
    const unreadIdsInPage = pageItems.filter((un) => !un.is_read).map((un) => un.user_notification_id);

    if (unreadIdsInPage.length > 0) {
      await prisma.user_notifications.updateMany({
        where: { user_notification_id: { in: unreadIdsInPage } },
        data: { is_read: true, read_at: new Date() },
      });
    }

    // Recompute unread count AFTER marking this page read, so the badge
    // reflects what's still unread beyond what was just shown.
    const unreadCount = await prisma.user_notifications.count({
      where: { user_id: userId, is_read: false },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          notifications: { today, yesterday, older },
          unreadCount,
          pagination: { nextCursor, hasNextPage, limit },
        },
        "Notifications fetched successfully"
      )
    );
  }
);