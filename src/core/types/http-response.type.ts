export type HttpResponse<T = undefined> = {
    error: boolean;
    status: number;
    message: string;
    data?: T;
}