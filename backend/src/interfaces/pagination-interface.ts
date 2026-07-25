import { Request } from "express";



export interface pagination extends Request {
    page: number,
    limit: number,
    skip: number
}