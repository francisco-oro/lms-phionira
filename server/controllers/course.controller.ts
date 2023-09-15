import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs"; 
import path from "path"; 
import { title } from "process";
import sendMail from "../utils/sendMail";

// Upload course
export const uploadCourse = CatchAsyncError(async (req: Request, res:Response, next:NextFunction) => {
    try {
        const data = req.body; 
        const thumbnail = data.thumbnail; 
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });
            console.log(myCloud)
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        createCourse(data, res, next);

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }
});

// Edit course
export const editCourse = CatchAsyncError(async (req:Request,res:Response, next:NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url:myCloud.secure_url,
            }
        }

        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(courseId, {
            $set:data
            },
            {new: true}
        );

        res.status(201).json({
            success: true,
            course,
        })
    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }
});

// Get single course -- without purchasing 
export const getSingleCourse = CatchAsyncError(async(req:Request,res:Response, next:NextFunction) => {
    try {

        const courseId = req.params.id;

        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course,
            });
        } else {
            const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.videoPlayer -courseData.suggestion -courseData.questions -courseData.links");
            
            await redis.set(courseId, JSON.stringify(course));

            res.status(200).json({
                success: true,
                course,
            });
        }

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }
})

// Get all courses -- without purchasing
export const getAllCourses = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const isCacheExist = await redis.get("allCourses");
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);

            res.status(200).json({
                success: true,
                courses,
            });

        } else {
            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links -courseData.videoPlayer")

            await redis.set("allCourses", JSON.stringify(courses));

            res.status(200).json({
                success:true,
                courses
            }); 
        }

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }
})

// Get course content --only for valid user
export const getCourseByUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id; 

        console.log(courseId);

        const courseExists = userCourseList?.find((course:any) => course._id === courseId);

        if (!courseExists) {
            return next(new ErrorHandler("You're not eligible to access this course", 404));
        }

        const course = await CourseModel.findById(courseId);

        const content = course?.courseData;

        res.status(200).json({
            success:true,
            course
        })

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }
})

// Add question in course
interface  IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string; 
}

export const addQuestion = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {question, courseId, contentId}: IAddQuestionData = req.body;
        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid course id", 400));
        }

        const courseContent = course?.courseData?.find((item:any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Invalid content Id", 400));
        }

        // Create a new question object 
        const newQuestion:any = {
            user: req.user,
            question, 
            questionReplies: [],
        }; 

        // Add this question to our course content
        courseContent.questions.push(newQuestion);

        // Save the updated course
        await course?.save();

        res.status(200).json({
            success: true,
            course, 
        })

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500)); 
    }
})

// Add answer in course question 
interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string; 
}

export const addAnswer = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }:IAddAnswerData = req.body;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const courseContent = course?.courseData?.find((item:any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Invalid content Id", 400));
        }

        const question = courseContent?.questions?.find((item:any) => 
            item._id.equals(questionId)
        );

        if (!question) {
            return next(new ErrorHandler("Invalid question id", 400))
        }

        // Create a new answer object
        const newAnswer: any = {
            user: req.user,
            answer,
        }

        // Add this answer to our course content 
        question.questionReplies.push(newAnswer);

        await course?.save();

        if(req.user?._id  === question.user._id){
            // Create a notification
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
                email: question.user.email
            }

            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), 
            data);

            try {
                await sendMail({
                    email: question.user.email,
                    subject: `Nueva respuesta en ${courseContent.title}`,
                    template: "question-reply.ejs",
                    data, 
                })
            } catch (error:any) {
                return next(new ErrorHandler(error.message, 500));
            }

            res.status(200).json({
                success:true,
                course
            })
        
        }

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


// Add a review in the course
interface IAddReviewData {
    review: string; 
    courseId: string;
    rating: number;
    userId: string; 
}

export const addReview = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userCourseList = req.user?.courses;

        const courseId = req.params.id;

        console.log(courseId);

        // Check if courseId already exists in uscerCourseList basedn on ._id 

        const courseExists = userCourseList?.some((course:any) => course._id.toString() === courseId.toString());
    
        if (!courseExists) {
            return next(new ErrorHandler("You are not eligible to access this resource", 404));
        }

        const course = await CourseModel.findById(courseId);

        const { review, rating } = req.body as IAddReviewData;

        const reviewData:any = {
            user:req.user,
            comment: review,
            rating 
        }

        course?.reviews.push(reviewData);

        let avg = 0;

        course?.reviews.forEach((rev:any) => {
            avg += rev.rating;
        });

        if (course) {
            course.ratings = avg / course.reviews.length; 
        }

        await course?.save(); 

        const notification = { 
            title: "Nueva valoración recibida",
            message: `${req.user?.name} ha puesto una nueva valoración en ${course?.name}`
        }

        // Create notification

        res.status(200).json({
            success: true,
            course, 
        }); 

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500)); 
    }
});

interface IAddReviewData { 
    comment: string;
    courseId: string; 
    reviewId: string; 
}

// Add reply in review 
export const addReplyToReview = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { comment, courseId, reviewId} = req.body as IAddReviewData;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const review = course?.reviews?.find((rev:any)=>rev._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }

        const replyData: any = {
            user: req.user,
            comment
        }

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);

        await course?.save();

        res.status(200).json({
            success: true,
            course, 
        });

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500))
    }
}); 