import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const generateMobilizerUniqueId = (
    centerCode: string,
    date: Date,
    serialNumber: number
): string => {
    const formattedDate = [
        String(date.getDate()).padStart(2, "0"),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getFullYear()).slice(-2),
    ].join("");

    const formattedSerial = String(serialNumber).padStart(4, "0");

    return `${centerCode}-${formattedDate}-${formattedSerial}`;
};