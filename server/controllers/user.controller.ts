require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";
import cron from  "node-cron"; 
import NotificationModel from "../models/notification.model";

// Register user
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            const isEmailExist = await userModel.findOne({ email });
            if (isEmailExist) {
                return next(
                    new ErrorHandler(
                        "Ya existe una cuenta asociada a esa dirección de correo electrónico",400
                    )
                );
            }

            const user: IRegistrationBody = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);

            const activationCode = activationToken.activationCode;

            const data = {
                user: { name: user.name, email: user.email },
                activationCode,
            };
            const html = await ejs.renderFile(
                path.join(__dirname, "../mails/activation-mail.ejs"),
                data
            );

            try {
                await sendMail({
                    email: user.email,
                    subject: "Activa tu cuenta en Phionira",
                    template: "activation-mail.ejs",
                    data,
                });

                res.status(201).json({
                    success: true,
                    message: `Por favor revisa tu bandeja de entrada en ${user.email} para activar tu cuenta`,
                    activationToken: activationToken.token,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m",
        }
    );

    return { token, activationCode };
};

// Activate user

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
};

export const activateUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code } =
                req.body as IActivationRequest;

            const newUser: { user: IUser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string };
            
            console.log(newUser.activationCode); 
            if (newUser.activationCode !== activation_code) {
                return next(new ErrorHandler("Código de activación inválido", 400));
            }

            const { name, email, password } = newUser.user;
            console.log(newUser.user);
            console.log(name, email, password); 

            const existsUser = await userModel.findOne({ email });
            console.log(existsUser);

            if (existsUser) {
                return next(
                    new ErrorHandler(
                        "Ya existe una cuenta asociada a esa dirección de correo electrónico",
                        409
                    )
                );
            }

            const user = await userModel.create({
                name,
                email,
                password,
            });

            res.status(201).json({
                success: true,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// Login user 
interface ILoginRequest {
    email: string;
    password: string; 
}

export const loginUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, password} = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler("Por favor ingresa una tu correo y tu contraseña", 400))
        }

        const user = await userModel.findOne({email}).select("+password");

        if (!user) {
            return next(new ErrorHandler("No existe una cuenta asociada al email proporcionado", 400))
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("La contraseña no es correcta", 400))
        };

        sendToken(user, 200, res);

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400))
    }
}); 

// logout user
export const logoutUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        res.cookie("access_token", "", {maxAge: 1});
        res.cookie("refresh_token", "", {maxAge: 1});
        const userId = req.user?._id || "";
        redis.del(userId);

        res.status(200).json({
            success: true,
            message: "Has cerrado sesión exitosamente"
        }); 

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

// Update access token 
export const updateAccessToken = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string; 
        const decoded = jwt.verify(refresh_token,
            process.env.REFRESH_TOKEN as string) as JwtPayload;

            const message = "Could not refresh token";
            if (!decoded) {
                return next(new ErrorHandler(message, 400));
            }

            const session = await redis.get(decoded.id as string);

            if (!session) {
                return next(new ErrorHandler("Por favor inicia sesión para acceder a este recurso ", 400));
            }

            const user = JSON.parse(session);

            const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN as string, {
                expiresIn: "5m",
            });

            const refreshToken = jwt.sign({ id: user._id}, process.env.REFRESH_TOKEN as string, {
                expiresIn: "3d"
            });

            req.user = user;

            res.cookie("access_token", accessToken, accessTokenOptions );
            res.cookie("refresh_token", refreshToken, refreshTokenOptions );
            
            await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days

            res.status(200).json({
                status: "sucess",
                accessToken
            })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

// get user info 
export const getUserInfo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const userId = req.user?._id;
        getUserById(userId, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string; 
}

// social auth
export const socialAuth = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            const newUser = await userModel.create({ email, name, avatar });
            sendToken(newUser, 200, res);
        } else {
            sendToken(user, 200, res);
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// Update user info
interface IUpdateUserInfo {
    name?: string;
    email?: string; 
}

export const updateUserInfo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {name, email} = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        console.log(userId)
        const user = await userModel.findById(userId);

        if (email && user) {
            const isEmailExist = await userModel.findOne({email});
            if (isEmailExist) {
                return next(new ErrorHandler("Esa dirección de correo electrónico ya está asociada a una cuenta", 400));
            }
            user.email = email;
        }

        if (name && user) {
            user.name = name;
        }

        await user?.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(201).json({
            success: true,
            user,
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// Update user password
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string; 
}

export const updatePassword = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {oldPassword, newPassword} = req.body as IUpdatePassword;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Por favor ingresa tu contraseña antigua y una nueva contraseña", 400)); 
        }

        const user = await userModel.findById(req.user?._id).select("password"); 

        if (user?.password === undefined) {
            return next(new ErrorHandler("Usuario no válido", 400)); 
        }

        const isPasswordMatch = await user?.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("La contraseña antigua no es correcta", 400));
        }

        user.password = newPassword; 

        await user.save();

        await redis.set(req.user?._id, JSON.stringify(user)); 

        res.status(201).json({
            success: true,
            user,
        }); 

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

interface IUpdateProfilePicture {
    avatar: string; 
}

// Update profile picture avatar

export const updateProfilePicture = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        
        const { avatar } = req.body; 

        const userId = req.user._id;

        const user = await userModel.findById(userId);

        if (avatar && user) {
            // If user have one avatar then call this if
            if (user?.avatar?.public_id) {
                // First delete the old image 
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                }); 
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            } else {
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                }); 
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }
        }

        await user?.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            sucess: true,
            user, 
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});


//  Get all users --only for admin

export const getAllUsers = CatchAsyncError(
    async (req:Request, res:Response, next:NextFunction) => {
        try {
            getAllUsersService(res);
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400)); 
        }
    }
)

// Update user role --only for admin
export const updateUserRole = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { id, role } = req.body; 
        updateUserRoleService(res, id, role);
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Delete user --only for admin
export const deleteUser = CatchAsyncError(async(req:Request, res:Response, next:Function) => {
    try {
        const {id} = req.params; 

        const user = await userModel.findById(id);

        if(!user){ 
            return next(new ErrorHandler("User not found", 404));
        }

        await user.deleteOne({id});

        await redis.del(id);

        res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente",
        }); 

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});