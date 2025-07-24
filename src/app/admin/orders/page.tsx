'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type OrderItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
};

type Order = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
};

const Orders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const res = await fetch(`/api/orders/user/${session.user.id}`);
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          console.error('Failed to fetch orders:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [session, status]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order ID: {order._id}</h3>
                  <p>Status: <span className="capitalize">{order.status}</span></p>
                  <p>Total: ${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p>{item.product.name}</p>
                        <p>Price: ${item.product.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
