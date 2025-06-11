import { Response } from "express"

// types
import { HttpResponse } from "../core/types/http-response.type";

export const responseSuccess = <T>(res: Response, httpResponse: HttpResponse<T>) => {
    res.status(httpResponse.status).send(httpResponse);
}
export const responseError = (res: Response, error: any) => {
    const status = error.status || 500;
    const message = error.message.replaceAll(/\"/g, '')|| 'Internal Server Error';
    res.status(status).send({
        error: true,
        status,
        message
    });
}