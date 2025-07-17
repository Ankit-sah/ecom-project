'use client';

import { useEffect, useState } from 'react';
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

const ProductCard = ({ product }: { product: Product }) => (
  <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">
    <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-md mb-2" />
    <h2 className="text-xl font-semibold">{product.title}</h2>
    <p className="text-gray-600">{product.description}</p>
    <p className="text-green-700 font-bold mt-2">${product.price}</p>
    <p className={`mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
      {product.inStock ? 'In Stock' : 'Out of Stock'}
    </p>
  </div>
);

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProducts();
  }, []);

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
            <ProductCard key={product._id} product={product} />
          ))}
      </section>
    </main>
  );
}
