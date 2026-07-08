
import { Request, Response, NextFunction } from "express";
import z from "zod";

export const  validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((err) => ({ 
            fields: err.path[0],
            message: err.message,
          })),
        });
      }
      next(error); 
    }
  };
}