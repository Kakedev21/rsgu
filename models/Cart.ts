import mongoose, { Schema, models } from "mongoose";

const CartSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

}, {timestamps: true});

const Cart = models.cart || mongoose.model("cart", CartSchema);

export default Cart;