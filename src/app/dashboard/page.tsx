"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { ShoppingBagIcon, ChartBarIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { data: session } = useSession();

  // Mock data - replace with real data from your API
  const stats = [
    { name: 'Total Orders', value: '1,234', icon: ShoppingBagIcon },
    { name: 'Revenue', value: '$24,567', icon: ChartBarIcon },
    { name: 'Pending Orders', value: '23', icon: ClockIcon },
    { name: 'New Customers', value: '56', icon: UserGroupIcon },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Alex Johnson', date: '2023-05-15', amount: '$125.99', status: 'Shipped' },
    { id: 'ORD-002', customer: 'Maria Garcia', date: '2023-05-14', amount: '$89.50', status: 'Processing' },
    { id: 'ORD-003', customer: 'James Smith', date: '2023-05-13', amount: '$234.00', status: 'Delivered' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!</span>
              <Button as={Link} href="/admin/products" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Manage Products
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
            <p className="mt-1 text-sm text-gray-500">Overview of your recent store activity</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link href={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
            <Button as={Link} href="/orders" className="text-indigo-600 hover:text-indigo-900">
              View all orders →
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Button as={Link} href="/admin/products/new" className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Add Product
                </Button>
                <Button as={Link} href="/admin/orders" className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  Manage Orders
                </Button>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white shadow overflow-hidden rounded-lg col-span-1 lg:col-span-2">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-4 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm text-gray-600">New order #{1000 + item} placed</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}