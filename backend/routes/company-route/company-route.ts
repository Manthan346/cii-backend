import { Router } from "express";
import { createCompany } from "../../src/controllers/company-controllers/create-company";
import { validateBody } from "../../src/middlewares/zod-middleware/zod-middleware";
import { companySchema } from "../../src/services/zod/company/company.schema";


const companyRouter = Router()


companyRouter.post('/create-company', validateBody(companySchema),createCompany)


export {
    companyRouter
}