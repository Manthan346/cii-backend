// import { Request, Response } from "express";
// import { asyncHandler } from "../../helpers/asyncHandler";
// import { prisma } from "../../lib/prisma";
// import { ApiResponse } from "../../helpers/ApiResponse";




// const createCompany = asyncHandler(async(req: Request, res: Response) => {
//     const {company_name,company_description } = req.body
//     const company = await prisma.company.create({
//         data: {
//             company_name: company_name,
//             company_description: company_description
//         }

//     })

//     return res.status(201).json(
//         new ApiResponse(201, {
//             company: company

//         }, "company created successfully")
//     )


// })

// export {
//     createCompany
// }