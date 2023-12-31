require("dotenv").config(); 
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const emailRegexPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    },
    role: string;
    phoneNumber: string;
    dateOfBirth: Date; 
    isVerified: boolean; 
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>; 
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor Ingresa tu nombre"],
    }, 
    email: {
        type: String,
        required: [true, "Por favor ingresa tu dirección de correo electŕonico"],
        validate: {
            validator: function (value:string){
                return emailRegexPattern.test(value);
            },
            message: "Por favor ingresa una dirección de correo electrónico válida"
        },
        unique: true, 
    },
    password:{
        type: String,
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    }, 
    role: {
        type: String,
        default: "user",
    },
    phoneNumber: {
        type: String,
        minlength: [10, "Escriba su número telefónico a diez dígitos"]
    },
    dateOfBirth: {
        type: Date, 
    }, 
    isVerified: {
        type:Boolean,
        default: false,
    }, 
    courses:[
        {
            courseId: String
        }
    ]
}, 
{timestamps:true});

// Hash Password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Sign access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '', {
        expiresIn: "5m",
    });
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '', {
        expiresIn: "3d",
    });
}

// compare password
userSchema.methods.comparePassword = async function (enteredPassword:string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel: Model<IUser> = mongoose.model("user", userSchema);

export default userModel;