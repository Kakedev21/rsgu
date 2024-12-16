import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    productId: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    status: {
      type: String
    },
    availableSizes: [
      {
        size: String,
        yards: Number
      }
    ],
    limit: {
      type: Number
    }
  },
  { timestamps: true }
);

const Product = models.products || mongoose.model('products', ProductSchema);

export default Product;
