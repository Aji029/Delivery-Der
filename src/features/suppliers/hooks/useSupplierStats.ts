import { useMemo } from 'react';
import { useOrders } from '../../../context/OrderContext';
import { useSuppliers } from '../../../context/SupplierContext';

export function useSupplierStats(date?: Date) {
  const { orders } = useOrders();
  const { suppliers } = useSuppliers();

  return useMemo(() => {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === targetDate.getTime();
    });

    return suppliers.map(supplier => {
      const supplierOrders = filteredOrders.filter(order =>
        order.items.some(item => item.product.supplierId === supplier.id)
      );

      const totalAmount = supplierOrders.reduce((sum, order) => {
        const supplierItems = order.items.filter(item => 
          item.product.supplierId === supplier.id
        );
        return sum + supplierItems.reduce((itemSum, item) => 
          itemSum + (item.quantity * item.vkPrice), 0
        );
      }, 0);

      return {
        ...supplier,
        orderCount: supplierOrders.length,
        totalAmount,
      };
    }).filter(supplier => supplier.orderCount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [orders, suppliers, date]);
}