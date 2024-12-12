import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../lib/db';
import type { Customer } from './CustomerContext';
import type { Product } from './ProductContext';

export interface OrderItem {
  product: Product;
  quantity: number;
  ekPrice: number;
  vkPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  totalAmount: number;
  orderDate: Date;
  deliveryDate?: Date;
  paymentStatus: 'Pending' | 'Paid' | 'Overdue';
  shippingAddress: string;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, order: Order) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  isLoading: boolean;
  error: string | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrderContext = async (order: Omit<Order, 'id'>) => {
    try {
      setIsLoading(true);
      await createOrder(order);
      await loadOrders();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderContext = async (id: string, order: Order) => {
    try {
      setIsLoading(true);
      await updateOrder(id, order);
      await loadOrders();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrderContext = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteOrder(id);
      await loadOrders();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder: addOrderContext,
      updateOrder: updateOrderContext,
      deleteOrder: deleteOrderContext,
      getOrder,
      isLoading,
      error,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}