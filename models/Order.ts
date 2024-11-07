import mongoose, { Schema, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    productId: {
      type: [{ type: Schema.Types.ObjectId, ref: 'products', required: true }]
    },
    productAndQty: {
      type: [{ type: Object }]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    cashier: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false
    }
  },
  { timestamps: true }
);

const Order = models.order || mongoose.model('order', OrderSchema);

export default Order;
