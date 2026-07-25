import z from "zod"
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { Request, Response, NextFunction } from "express";

export const validateQuery = (schema: z.ZodSchema) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json(
        new ApiResponse(400, null, result.error.issues.map((i) => i.message).join(", "))
      );
    }
   req.validatedQuery = result.data; // now typed and guaranteed valid
    next();
  });   