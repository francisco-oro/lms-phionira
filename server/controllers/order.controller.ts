import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, {IOrder}from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs"; 
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";

// Create order
export const createOrder = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {courseId, payment_info, qty } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = await user?.courses.some((course:any) => course._id.toString() === courseId); 

        if (courseExistInUser) {
            return next(new ErrorHandler("Ya has comprado este curso", 400));

        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));

        }

        const data:any = {
            courseId: course._id,
            userId: user?._id,
            payment_info, 
            qty
        };

        console.log(data);

        const mailData = {
            order: {
                _id: course._id.toString().slice(0,6),
                name: course.name, 
                price: course.price,
                date: new Date().toLocaleDateString('es', {year:'numeric', month: 'long', day:'numeric'}),
                qty: qty,
                username: user?.name,
                email: user?.email,
            }
        }

        console.log(mailData.order);

        const html = await ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'), {order: mailData});
        
        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Confirimación de Orden | Phionira",
                    template: "order-confirmation.ejs",
                    data: mailData
                }); 
            }
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 500)); 
        }

        user?.courses.push(course?._id);
        await user?.save(); 

        await NotificationModel.create({
            user: user?._id,
            title:  `Nueva orden`,
            message: `Hay una nueva compra en ${course?.name}`
        });

        course.purchased ? course.purchased += 1 : course.purchased; 

        await course.save();

        newOrder(data, res, next);

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Get all orders --only for admin

export const getAllOrders = CatchAsyncError(
    async (req:Request, res:Response, next:NextFunction) => {
        try {
            getAllOrdersService(res);
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400)); 
        }
    }
)