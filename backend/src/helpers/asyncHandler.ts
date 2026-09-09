import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client"; // adjust to your actual generated-client path

// Prisma's `meta.target` can be a string, an array of strings, or absent
// depending on the database and constraint type — normalize it once.
const formatTarget = (target: unknown): string => {
    if (Array.isArray(target)) return target.join(", ");
    if (typeof target === "string") return target;
    return "field";
};

const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error: any) {
        // ---- Prisma-specific errors, handled first and explicitly ----
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002": { // unique constraint violation
                    const field = formatTarget(error.meta?.target);
                    return res.status(409).json({
                        success: false,
                        message: `Duplicate value for ${field}. Please provide a unique value.`,
                    });
                }

                case "P2025": // record not found (update/delete on missing row)
                    console.error("Prisma record not found:", error.meta?.cause || error.message);
                    return res.status(404).json({
                        success: false,
                        message: "Requested record not found",
                    });

                case "P2003": { // foreign key constraint failed
                    const field = formatTarget(error.meta?.field_name);
                    console.error("Prisma foreign key violation:", field, error.message);
                    return res.status(400).json({
                        success: false,
                        message: "Invalid reference to a related record",
                    });
                }

                case "P2014": // required relation violation (e.g. deleting a still-referenced record)
                    console.error("Prisma relation violation:", error.meta, error.message);
                    return res.status(400).json({
                        success: false,
                        message: "This action would violate a required relationship between records",
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
            // error.message here is a large, technical, multi-line dump of
            // field/type details — log it in full for debugging, but never
            // send it to the client since it can leak internal schema details
            // and isn't meaningful to an API consumer anyway.
            console.error("Prisma validation error:", error.message);
            return res.status(400).json({
                success: false,
                message: "Invalid data provided in request",
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