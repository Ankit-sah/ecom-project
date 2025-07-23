"use client"
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';


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


export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.items || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-10">Loading products...</div>;
  }

  if (!products.length) {
    return <div className="text-center text-lg mt-10">No products found.</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products
          .filter(product => !product.isDeleted)
          .map(product => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}
      </section>
    </main>
  );
}
