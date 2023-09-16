import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { redis } from "../utils/redis";

// Authenticated user 
export const isAuthenticated = CatchAsyncError(
    async(req:Request, res:Response, next:NextFunction) => {
    const access_token = req.cookies.access_token as string; 

    if (!access_token) {
        return next(new ErrorHandler("Por favor inicia sesión para acceder a este recurso", 403))
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decoded) {
        return next(new ErrorHandler("El token de acceso no es válido ", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
        return next(new ErrorHandler("Por favor inicia sesión para acceder a este recurso", 400)); 
    }

    req.user = JSON.parse(user);

    next();
});

// Validate user role
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res:Response, next:NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`role ${req.user?.role} is not allowed to access this resource`, 403))
        }
        next();
    }
}