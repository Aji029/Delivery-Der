import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, DollarSign, Package, ShoppingCart, Users, ArrowRight } from 'lucide-react';
import { useDashboardStats } from '../../features/dashboard/hooks/useDashboardStats';
import { formatPrice } from '../../utils/priceCalculations';
import { formatDateForDisplay } from '../../utils/dateFormatting';

export function DashboardPage() {
  const stats = useDashboardStats();

  const statCards = [
    {
      name: 'Total Revenue',
      value: formatPrice(stats.revenue.total),
      change: `${stats.revenue.change.toFixed(1)}%`,
      trend: stats.revenue.change >= 0 ? 'up' : 'down',
      icon: DollarSign,
    },
    {
      name: 'Active Orders',
      value: stats.activeOrders.total.toString(),
      change: `${stats.activeOrders.change.toFixed(1)}%`,
      trend: stats.activeOrders.change >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      link: '/dashboard/orders',
    },
    {
      name: 'Total Products',
      value: stats.products.total.toString(),
      change: `${stats.products.change.toFixed(1)}%`,
      trend: stats.products.change >= 0 ? 'up' : 'down',
      icon: Package,
      link: '/dashboard/products',
    },
    {
      name: 'Total Customers',
      value: stats.customers.total.toString(),
      change: `${stats.customers.change.toFixed(1)}%`,
      trend: stats.customers.change >= 0 ? 'up' : 'down',
      icon: Users,
      link: '/dashboard/customers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Icon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className={`ml-2 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
              {stat.link && (
                <Link
                  to={stat.link}
                  className="mt-4 inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="h-32 w-32 text-gray-400" />
            <p className="text-gray-500">Sales chart will be implemented here</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateForDisplay(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}