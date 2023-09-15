import mongoose, {Document,Model,Schema} from "mongoose";


export interface IOrder extends Document{
    courseId: string;
    userId?:string;
    payment_info: object;
    qty: number,
}

const orderSchema = new Schema<IOrder>({
    courseId: {
     type: String,
     required: true
    },
    userId:{
        type: String,
        required: true
    },
    payment_info:{
        type: Object,
        // required: true
    },
    qty: {
        type: Number, 
        required: true,
        default: 1, 
    }
},{timestamps: true});

const OrderModel: Model<IOrder> = mongoose.model('Order',orderSchema);

export default OrderModel;