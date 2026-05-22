import { NextFunction, Request, Response } from 'express';
import { AppError }                         from "../utils/AppError";

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message
        });
        return;
    }

    if (error instanceof Error) {
        res.status(500).json({
            message: error.message
        });
        return;
    }

    res.status(500).json({
        message: 'Internal server error'
    });
}