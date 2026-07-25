import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client"; // adjust to your actual generated-client path

const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error: any) {
        // ---- Prisma-specific errors, handled first and explicitly ----
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002": // unique constraint violation
                    return res.status(409).json({
                        success: false,
                        message: `Duplicate value for ${(error.meta?.target as string[])?.join(", ")   || "field"} please provide a unique value`,
                    });
                case "P2025": // record not found (update/delete on missing row)
                    return res.status(404).json({
                        success: false,
                        message: "Requested record not found",
                    });
                case "P2003": // foreign key constraint failed
                    return res.status(400).json({
                        success: false,
                        message: "Invalid reference to a related record",
                    });
                default:
                    console.error("Prisma known error:", error.code, error.message);
                    return res.status(400).json({
                        success: false,
                        message: "Database request failed",
                    });
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            console.error("Prisma validation error:", error.message);
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            });
        }

        if (error instanceof Prisma.PrismaClientInitializationError) {
            console.error("Prisma initialization error:", error.message);
            return res.status(503).json({
                success: false,
                message: "Database connection failed",
            });
        }

        // ---- Your existing custom-error handling, unchanged ----
        const err = error as { statusCode?: number; code?: number | string; message?: string };
        const statusCode = Number(err.statusCode) || 500;
        console.error(error);
        res.status(statusCode).json({
            success: false,
            message: err.message || "An error occurred",
        });
    }
};

export { asyncHandler };