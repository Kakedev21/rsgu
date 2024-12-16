import mongoose, { Schema, models } from 'mongoose';

const sizeSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    size: {
      type: String
    },
    yards: {
      type: Number
    }
  },
  { timestamps: true }
);

const Size = models.size || mongoose.model('size', sizeSchema);

export default Size;
