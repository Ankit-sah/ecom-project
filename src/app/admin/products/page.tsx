"use client"
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { Button } from '@headlessui/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowPathIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Loading products...');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.items || []);
      toast.success('Products loaded', { id: loadingToast });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const deleteToast = toast.loading('Moving to trash...');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}/trash`, {
        method: 'PATCH',
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success('Product moved to trash', { id: deleteToast });
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product', { id: deleteToast });
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    const restoreToast = toast.loading('Restoring product...');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}/restore`, {
        method: 'PATCH',
      });

      if (res.ok) {
        await fetchProducts();
        toast.success('Product restored', { id: restoreToast });
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error('Error restoring product:', error);
      toast.error('Failed to restore product', { id: restoreToast });
    } finally {
      setRestoringId(null);
    }
  };

  const activeProducts = products.filter(p => !p.isDeleted);
  const trashedProducts = products.filter(p => p.isDeleted);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500">
            {activeProducts.length} active • {trashedProducts.length} trashed
          </p>
        </div>
        <Button
          as={Link}
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Products Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Products</h2>
            {activeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                    adminView
                    isDeleting={deletingId === product._id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No active products found</p>
                <Button
                  as={Link}
                  href="/admin/products/new"
                  className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </div>
            )}
          </section>

          {/* Trashed Products Section */}
          {trashedProducts.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Trashed Products</h2>
                <span className="text-sm text-gray-500">{trashedProducts.length} items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trashedProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onRestore={handleRestore}
                    adminView
                    isDeleting={restoringId === product._id}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}