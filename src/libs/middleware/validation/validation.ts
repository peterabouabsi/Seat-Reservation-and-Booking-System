import { Request, Response, NextFunction } from "express";

import createError from "http-errors";
import { ObjectSchema } from "joi";

export function bodyValidation(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const message = error.details[0].message;
            return next(createError(400, message));
        }

        next();
    } catch (error: any) {
        next(error);
    }
  };
}