import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        state: {
            type: Object,
            required: true,  
        },     
        items: {
            type: Array,
            required: true,
            default: []
        },
        comment: {
            type: String,           
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;