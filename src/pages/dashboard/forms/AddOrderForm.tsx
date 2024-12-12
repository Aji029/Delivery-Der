import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { useOrders } from '../../../context/OrderContext';
import { useCustomers } from '../../../context/CustomerContext';
import { useProducts } from '../../../context/ProductContext';
import { useSuppliers } from '../../../context/SupplierContext';
import { validatePrices, calculateOrderTotal } from '../../../utils/priceCalculations';

interface OrderItem {
  productId: string;
  supplierId: string;
  quantity: number;
  ekPrice: number;
  vkPrice: number;
}

interface OrderFormData {
  customerId: string;
  items: OrderItem[];
  deliveryDate: string;
  shippingAddress: string;
  notes: string;
}

const initialOrderItem: OrderItem = {
  productId: '',
  supplierId: '',
  quantity: 1,
  ekPrice: 0,
  vkPrice: 0,
};

const initialFormData: OrderFormData = {
  customerId: '',
  items: [{ ...initialOrderItem }],
  deliveryDate: '',
  shippingAddress: '',
  notes: '',
};

export function AddOrderForm() {
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...initialOrderItem }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item };

          if (field === 'productId') {
            const product = products.find(p => p.artikelNr === value);
            if (product) {
              updatedItem.productId = value;
              updatedItem.ekPrice = product.ekPrice;
              updatedItem.vkPrice = product.vkPrice;
              // Keep the existing supplierId if it exists
              if (product.supplierId) {
                updatedItem.supplierId = product.supplierId;
              }
            }
          } else if (field === 'supplierId') {
            updatedItem.supplierId = value as string;
          } else {
            updatedItem[field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
          }

          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) {
      alert('Please select a customer');
      return;
    }

    // Validate all items have suppliers
    const missingSuppliers = formData.items.some(item => !item.supplierId);
    if (missingSuppliers) {
      alert('Please select suppliers for all items');
      return;
    }

    const orderItems = formData.items
      .filter(item => item.productId && item.quantity > 0)
      .map(item => {
        const product = products.find(p => p.artikelNr === item.productId);
        if (!product) {
          throw new Error('Product not found');
        }

        const validation = validatePrices(item.ekPrice, item.vkPrice);
        if (validation) {
          alert(`Invalid prices for ${product.name}: ${validation}`);
          return null;
        }

        return {
          product: {
            ...product,
            supplierId: item.supplierId,
          },
          quantity: item.quantity,
          ekPrice: item.ekPrice,
          vkPrice: item.vkPrice,
          total: item.vkPrice * item.quantity,
        };
      });

    if (orderItems.includes(null)) return;

    try {
      const newOrder = {
        customer,
        items: orderItems as any[],
        status: 'Pending' as const,
        totalAmount: calculateOrderTotal(orderItems as any[]),
        orderDate: new Date(),
        deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
        paymentStatus: 'Pending' as const,
        shippingAddress: formData.shippingAddress || customer.address,
        notes: formData.notes,
      };

      await addOrder(newOrder);
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">New Order</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button type="button" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map(product => (
                          <option key={product.artikelNr} value={product.artikelNr}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier
                      </label>
                      <select
                        value={item.supplierId}
                        onChange={(e) => handleItemChange(index, 'supplierId', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EK Price
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.ekPrice}
                        onChange={(e) => handleItemChange(index, 'ekPrice', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VK Price
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.vkPrice}
                        onChange={(e) => handleItemChange(index, 'vkPrice', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Delivery Date"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <div className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-700">
                  €{calculateOrderTotal(formData.items.map(item => ({
                    quantity: item.quantity,
                    vkPrice: item.vkPrice,
                  }))).toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <textarea
                value={formData.shippingAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Enter shipping address or leave empty to use customer's address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/dashboard/orders')}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}