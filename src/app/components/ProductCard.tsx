'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@headlessui/react';
import { TrashIcon, ArrowPathIcon, PencilIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';


interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
    isDeleted: boolean;
  };
  onDelete?: (id: string) => Promise<void>;
  onRestore?: (id: string) => Promise<void>;
  adminView?: boolean;
  isDeleting?: boolean;
}

export default function ProductCard({
  product,
  onDelete,
  onRestore,
  adminView = false,
  isDeleting = false,
}: ProductCardProps) {
  const [localLoading, setLocalLoading] = useState(false);

  const handleAction = async (action: 'delete' | 'restore') => {
    setLocalLoading(true);
    try {
      if (action === 'delete' && onDelete) {
        await onDelete(product.id);
        toast.success('Product moved to trash');
      } else if (action === 'restore' && onRestore) {
        await onRestore(product.id);
        toast.success('Product restored successfully');
      }
    } catch (error) {
      toast.error(`Failed to ${action} product`);
      console.error(error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className={`group relative border rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
      product.isDeleted ? 'bg-gray-50 opacity-90' : 'bg-white'
    }`}>
      {/* Status Badge */}
      {adminView && (
        <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
          product.isDeleted ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {product.isDeleted ? 'Trashed' : 'Active'}
        </span>
      )}

      {/* Product Image */}
     { product?.image ? 
     <><div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md">
        <Image
          src={product?.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

      </div>
      </>:
      <>
        <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md">
        <Image
          src={"/images/burger.png"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

      </div>
      </>
    }

      {/* Product Details */}
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        {adminView ? (
          product.isDeleted ? (
            <Button
              onClick={() => handleAction('restore')}
              disabled={localLoading}
              className="flex w-full items-center justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 disabled:opacity-50"
            >
              {localLoading ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Restore
                </>
              )}
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                as={Link}
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-center rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => handleAction('delete')}
                disabled={isDeleting || localLoading}
                className="flex items-center justify-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
              >
                {(isDeleting || localLoading) ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              as={Link}
              href={`/products/${product.id}`}
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              Details
            </Button>
            <Button
              disabled={!product.inStock}
              className="flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}