// components/OrderCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface OrderCardProps {
  order: {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Order #{order._id.toString().slice(-6).toUpperCase()}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
            {order.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="p-4">
        {order.items.map((item) => (
          <div key={item.product._id} className="flex items-center py-2">
            <Image
              src={item.product.image}
              alt={item.product.name}
              width={64}
              height={64}
              className="rounded-md border"
            />
            <div className="ml-4">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-gray-600">
                {item.quantity} × ${item.product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t flex justify-between items-center">
        <span className="font-medium">Total: ${order.totalAmount.toFixed(2)}</span>
        <Link
          href={`/orders/${order._id}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}