import mongoose, { Schema, Document, models } from 'mongoose';

export interface IOrder extends Document {
  user: string; // Auth0 user ID as string
  items: {
    product: string; // Accept product ID as string
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: String, // Changed from ObjectId to String
      required: true,
    },
    items: [
      {
        product: {
          type: String, // Changed from ObjectId to String
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = models.Order || mongoose.model<IOrder>('Order', OrderSchema);
