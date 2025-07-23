'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  isDeleted: boolean;
}



const ProductCard = ({ product ,onDelete}: { product: Product,onDelete:any }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      router.refresh(); // Re-fetch data and rerender
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition relative">
      <div className="relative w-full h-48 mb-2">
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <h2 className="text-xl font-semibold">{product.title}</h2>
      <p className="text-gray-600 line-clamp-2">{product.description}</p>
      <p className="text-green-700 font-bold mt-2">${product.price}</p>
      <p className={`mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </p>

      <div className="flex gap-2 mt-4">
        
        <Link
          href={`/admin/products/${product._id}`}
          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
