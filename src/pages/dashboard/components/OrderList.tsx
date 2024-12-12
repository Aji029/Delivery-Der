import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../../context/OrderContext';
import { formatPrice } from '../../../utils/priceCalculations';
import { Edit, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderPDF } from '../../../components/OrderPDF';

interface OrderListProps {
  selectedDate?: string;
  selectedSupplierId?: string;
}

export function OrderList({ selectedDate, selectedSupplierId }: OrderListProps) {
  const navigate = useNavigate();
  const { orders, updateOrder } = useOrders();
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  const handleEndOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      const order = orders.find(o => o.id === orderId);
      if (order) {
        await updateOrder(orderId, {
          ...order,
          status: 'Completed',
          updated_at: new Date(),
        });
      }
    } catch (error) {
      console.error('Error ending order:', error);
    } finally {
      setProcessingOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by date if selected
    if (selectedDate) {
      const orderDate = new Date(order.orderDate);
      const filterDate = new Date(selectedDate);
      
      orderDate.setHours(0, 0, 0, 0);
      filterDate.setHours(0, 0, 0, 0);
      
      if (orderDate.getTime() !== filterDate.getTime()) {
        return false;
      }
    }

    // Filter by supplier if selected
    if (selectedSupplierId) {
      const hasSupplierItems = order.items.some(
        item => item.product.supplierId === selectedSupplierId
      );
      if (!hasSupplierItems) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No orders found for the selected filters
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.companyName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.contactPerson}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} items
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.map(item => item.product.name).join(', ').slice(0, 50)}
                      {order.items.length > 1 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/orders/${order.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <PDFDownloadLink
                        document={<OrderPDF order={order} />}
                        fileName={`order-${order.id}.pdf`}
                        className="inline-flex"
                      >
                        {({ loading }) => (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loading}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        )}
                      </PDFDownloadLink>

                      {order.status !== 'Completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEndOrder(order.id)}
                          isLoading={processingOrder === order.id}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          End
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}