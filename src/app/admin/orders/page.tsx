// app/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface OrderItem {
  product: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user/${session?.user?.id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (orders.length === 0) return <div className="p-4">No orders found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow-sm">
            <div className="mb-2 text-sm text-gray-500">
              <span>Order ID: {order.id}</span> |{' '}
              <span>Status: <strong className="capitalize">{order.status}</strong></span> |{' '}
              <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                 {item?.product?.image ? (
  <Image
    src={item.product.image}
    alt={item.product.name}
    width={60}
    height={60}
    className="rounded"
  />
) : (
  <div className="w-[60px] h-[60px] bg-gray-200 rounded" />
)}

                  <div className="flex-1">
                    <div className="font-semibold">{item?.product?.name}</div>
                    <div className="text-sm text-gray-500">
                      Quantity: {item?.quantity} × ${item?.product?.price}
                    </div>
                  </div>
                  <div className="text-right font-bold">
                    ${(item?.product?.price * item?.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right font-semibold text-lg">
              Total: ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
