import mongoose, { Schema, models } from 'mongoose';

const ReportSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    beginningInventory: {
      quantity: {
        type: Number,
        required: true
      },
      unitCost: {
        type: Number,
        required: true
      },
      unitPrice: {
        type: Number,
        required: true
      }
    },
    sales: {
      quantity: {
        type: Number,
        default: 0
      },
      unitCost: {
        type: Number,
        default: 0
      },
      unitPrice: {
        type: Number,
        default: 0
      }
    },
    endingInventory: {
      quantity: {
        type: Number
      },
      unitCost: {
        type: Number
      },
      unitPrice: {
        type: Number
      }
    }
  },
  { timestamps: true }
);

const Report = models.reports || mongoose.model('reports', ReportSchema);

export default Report;
