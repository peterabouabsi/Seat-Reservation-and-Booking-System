import { NextFunction, Request, Response } from "express";

// utils
import { responseError } from "../../../utils/response";

const catchError = (err: any, req: Request, res: Response, next: NextFunction) => {
    responseError(res, err);
};

export default catchError;