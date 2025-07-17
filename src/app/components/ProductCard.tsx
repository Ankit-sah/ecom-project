// components/ProductCard.tsx
import Image from 'next/image';
import React from 'react';

interface Props {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
  };
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <Image
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
