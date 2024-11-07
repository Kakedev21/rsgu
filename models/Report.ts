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
      totalCost: {
        type: Number,
        required: true
      }
    },
    received: {
      quantity: {
        type: Number,
        default: 0
      },
      unitCost: {
        type: Number,
        default: 0
      },
      totalCost: {
        type: Number,
        default: 0
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
      totalCost: {
        type: Number,
        default: 0
      }
    },
    endingInventory: {
      quantity: {
        type: Number,
        required: true
      },
      unitCost: {
        type: Number,
        required: true
      },
      totalCost: {
        type: Number,
        required: true
      }
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Report = models.reports || mongoose.model('reports', ReportSchema);

export default Report;
