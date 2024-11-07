import mongoose from 'mongoose';

const OrderTransactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Transfer'],
      required: true
    },
    transactionDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const OrderTransaction =
  mongoose.models.OrderTransaction ||
  mongoose.model('OrderTransaction', OrderTransactionSchema);

export default OrderTransaction;
