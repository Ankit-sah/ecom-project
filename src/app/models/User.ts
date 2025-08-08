// src/models/User.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  auth0Id: string;
  name: string;
  email: string;
  role?: 'admin' | 'customer';
  orders: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
