import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: number;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction):void {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({
            message: 'Authentication token is required',
        });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        res.status(500).json({
            message: 'JWT secret is not configured'
        });
        return;
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as JwtPayload;

        req.user = payload;

        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
}