import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { pagination } from "../../interfaces/pagination-interface";



 export const paginationMiddleware = asyncHandler(async(req: Request, res: Response,next: NextFunction) => {

    const  page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const skip = (page -1) * limit

    req.pagination = {
        limit,
        page,
        skip
    }
next()


})