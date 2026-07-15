import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "Each uploaded file must not exceed 5 MB.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
        });
    }
  }

  next(err);
};