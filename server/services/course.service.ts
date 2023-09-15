import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// Create course
export const createCourse = CatchAsyncError(async(data:any, res:Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true, 
        course
    });
})