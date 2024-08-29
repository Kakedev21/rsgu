import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    productId: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String
    },
   

}, {timestamps: true});

const Product = models.products || mongoose.model("products", ProductSchema);

export default Product;