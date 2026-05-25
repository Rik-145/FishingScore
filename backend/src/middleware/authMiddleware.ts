import { NextFunction, Request, Response } from 'express';
import jwt                                 from 'jsonwebtoken';
import { AppError }                        from "../utils/AppError";
import { UserRole }                         from "../types/user";

interface JwtPayload {
    userId: number;
    role: UserRole;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if (!token) {
        next(new AppError('Authentication token is required', 401));
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        next(new AppError('JWT secret is not configured', 500));
        return;
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as JwtPayload;

        req.user = payload;

        next();
    } catch (error) {
        next(new AppError('Invalid or expired token', 401));
    }
}