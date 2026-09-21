import cron from "node-cron";

import { prisma } from "../lib/prisma";

const notificationCleanupJob = async () => {
  try {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deletedNotifications = await prisma.notifications.deleteMany({
      where: {
        created_at: {
          lt: sevenDaysAgo,
        },
        OR: [
          {
            reference_type: {
              not: "EVENT",
            },
          },
          {
            reference_type: null,
          },
        ],
      },
    });

    console.log(
      `Notification cleanup completed. Deleted ${deletedNotifications.count} notifications.`,
    );
  } catch (error) {
    console.error("Notification cleanup job failed:", error);
  }
};

cron.schedule("25 15 * * *", notificationCleanupJob);

console.log("Notification cleanup job scheduled.");