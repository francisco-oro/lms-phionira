import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/anayltics.generator";
import userModel from "../models/user.model";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";

// Only admin can see this analityocs 
export const getUserAnalytics = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const users = await generateLast12MonthsData(userModel);

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }

})

// Only orders analytics can see this analityocs 
export const getOrdersAnalytics = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }

})

// Only courses analytics can see this analityocs 
export const getCoursesAnalytics = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel);

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }

})