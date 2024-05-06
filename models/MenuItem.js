import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 2,
            max: 100
        },
        description: {
            type: String,
            required: true,
            min: 2,
            max: 500
        },
        picturePath: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            min: 2,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
export default MenuItem;