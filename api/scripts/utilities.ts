import { Response } from "express";

const successResponse = <T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data,
        timestamp: new Date().toISOString(),
    });
};

const failResponse = (
    res: Response,
    error: string,
    statusCode: number = 400,
    errors?: Record<string, unknown>
) => {
    return res.status(statusCode).json({
        status: "fail",
        message: error,
        errors: errors || null,
        timestamp: new Date().toISOString(),
    });
};


export { successResponse, failResponse };