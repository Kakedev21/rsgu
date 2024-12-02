import mongoose, { Schema, models } from 'mongoose';

const LimitSchema = new Schema(
  {
    release: {
      type: Number
    },
    product: {
      type: Number
    }
  },
  { timestamps: true }
);

const Limit = models.Limit || mongoose.model('Limit', LimitSchema);

export default Limit;
