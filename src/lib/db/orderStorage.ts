import type { Order } from '../../context/OrderContext';

const STORAGE_KEY = 'der-stern-orders';

export const getOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    // Parse the data and handle date conversion
    return JSON.parse(data, (key, value) => {
      if (key === 'orderDate' || key === 'deliveryDate') {
        return value ? new Date(value) : null;
      }
      return value;
    });
  } catch (error) {
    console.error('Error reading orders from storage:', error);
    return [];
  }
};

export const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to storage:', error);
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  return getOrders();
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<void> => {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    orderDate: new Date(order.orderDate),
    deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
  };
  saveOrders([...orders, newOrder]);
};

export const updateOrder = async (id: string, order: Order): Promise<void> => {
  const orders = getOrders();
  const updatedOrders = orders.map(o => o.id === id ? {
    ...order,
    orderDate: new Date(order.orderDate),
    deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
  } : o);
  saveOrders(updatedOrders);
};

export const deleteOrder = async (id: string): Promise<void> => {
  const orders = getOrders();
  const updatedOrders = orders.filter(o => o.id !== id);
  saveOrders(updatedOrders);
};