import { NextFunction, Request, Response } from "express"

const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        const err = error as { statusCode?: number; code?: number | string; message?: string }
        const statusCode = Number(err.statusCode || err.code) || 500
        res.status(statusCode).json({
            success: false,
            message: err.message || "An error occurred"
        })
    }
}

export {asyncHandler}