// src/models/Product.ts

import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product =
  models.Product || mongoose.model<IProduct>('Product', ProductSchema);
