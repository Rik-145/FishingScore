import { NextFunction, Response } from 'express';
import { AuthenticatedRequest }   from "./authMiddleware";
import { UserRole }               from "../types/user";
import { AppError }               from "../utils/AppError";

export function requireRole(...allowedRoles: UserRole[]) {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            next(new AppError('Unauthenticated', 401));
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            next(new AppError('Forbidden', 403));
            return;
        }

        next();
    };
}