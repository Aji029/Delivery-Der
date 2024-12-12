import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '../../../context/OrderContext';
import { useProducts } from '../../../context/ProductContext';
import { useSuppliers } from '../../../context/SupplierContext';
import { OrderDetails } from '../../../features/orders/components/EditOrder/OrderDetails';
import { OrderItems } from '../../../features/orders/components/EditOrder/OrderItems';
import { DisputeSection } from '../../../features/orders/components/EditOrder/DisputeSection';
import { Button } from '../../../components/ui/Button';

export function EditOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getOrder, updateOrder } = useOrders();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const orderData = getOrder(id);
      if (orderData) {
        setOrder(orderData);
      } else {
        navigate('/dashboard/orders');
      }
    }
  }, [id, getOrder, navigate]);

  if (!order) return null;

  const handleUpdateItem = (index: number, updates: any) => {
    const updatedItems = [...order.items];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    setOrder({ ...order, items: updatedItems });
  };

  const handleAddItem = () => {
    const defaultProduct = products[0];
    setOrder({
      ...order,
      items: [
        ...order.items,
        {
          product: defaultProduct,
          quantity: 1,
          ekPrice: defaultProduct.ekPrice,
          vkPrice: defaultProduct.vkPrice,
          total: defaultProduct.vkPrice,
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = order.items.filter((_: any, i: number) => i !== index);
    setOrder({ ...order, items: updatedItems });
  };

  const handleAutoFillPrices = () => {
    const updatedItems = order.items.map((item: any) => {
      const product = products.find(p => p.artikelNr === item.product.artikelNr);
      if (product) {
        return {
          ...item,
          ekPrice: product.ekPrice,
          vkPrice: product.vkPrice,
        };
      }
      return item;
    });
    setOrder({ ...order, items: updatedItems });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateOrder(id!, {
        ...order,
        totalAmount: order.items.reduce((sum: number, item: any) => 
          sum + (item.quantity * item.vkPrice), 0
        ),
      });
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <OrderDetails
        order={order}
        onStatusChange={(status) => setOrder({ ...order, status })}
        onPaymentStatusChange={(paymentStatus) => setOrder({ ...order, paymentStatus })}
      />
      
      <OrderItems
        items={order.items}
        products={products}
        suppliers={suppliers}
        onUpdateItem={handleUpdateItem}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onAutoFillPrices={handleAutoFillPrices}
      />

      <DisputeSection
        disputes={disputes}
        onAddDispute={(dispute) => setDisputes([...disputes, { ...dispute, id: Date.now().toString() }])}
        onUpdateDispute={(id, updates) => {
          setDisputes(disputes.map(d => d.id === id ? { ...d, ...updates } : d));
        }}
      />

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/orders')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}