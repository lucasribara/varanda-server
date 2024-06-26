import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },        
        orders: {
            type: Array,
            default: []
        },
        role: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        homeNumber: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);
export default User;