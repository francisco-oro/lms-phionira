import ErrorHandeler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = (
    err:any, 
    req:Request, 
    res:Response, 
    next:NextFunction
    ) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong mongodb if error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandeler(message, 400);
    }

    // Declare key error
    if (err.code === 11000) {
        const message = `Duplicaye ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandeler(message, 400);
    }

    // Wrong jwt error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is invalid, try again';
        err = new ErrorHandeler(message, 400);
    }

    // JWT Expired error

    if (err.name === 'TokenExpiredError') {
        const message = 'Json web token is expired, try again';
        err = new ErrorHandeler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}