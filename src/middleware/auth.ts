import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../env';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

export const authenticateWithoutError = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return req.user = null;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return req.user = null;;
        }
        req.user = user;
        next();
    });
};