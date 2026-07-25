import "express";

declare global {
  namespace Express {
    interface Request {
         validatedQuery?: any; //
      pagination?: {
        page: number;
        limit: number;
        skip: number;
      };
    }
  }
}

export {};