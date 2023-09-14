import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
    isVerified: boolean; 
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>; 
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor Ingresa tu nombre"],
    }, 
    email: {
        type: String,
        required: [true, "Por favor ingresa tu dirección de correo electŕonicp"],
        validate: {
            validator: function (value:string){
                return emailRegexPattern.test(value);
            },
            message: "Por favor ingresa una dirección de correo electrónico válida"
        },
        unique: true, 
    },
    password:{
        type:String,
        required: [true, "Por favor ingresa una conraseña"], 
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
    isVerified: {
        type:Boolean,
        default: false,
    }, 
    courses:[
        {
            courseId: String
        }
    ]
}, {timestamps:true});

// Hash Password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// compare password
userSchema.methods.comparePassword = async function (enteredPassword:string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel: Model<IUser> = mongoose.model("user", userSchema);

export default userModel;