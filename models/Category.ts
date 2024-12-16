import mongoose, { Schema, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    productsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Category = models.category || mongoose.model('category', CategorySchema);

export default Category;
