import React from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { EditablePrice } from '../../../../components/ui/EditablePrice';
import { ProfitMarginDisplay } from '../../../../components/ProfitMarginDisplay';
import { formatPrice } from '../../../../utils/priceCalculations';

interface OrderItemsProps {
  items: any[];
  products: any[];
  suppliers: any[];
  onUpdateItem: (index: number, updates: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onAutoFillPrices: () => void;
}

export function OrderItems({
  items,
  products,
  suppliers,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onAutoFillPrices,
}: OrderItemsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onAutoFillPrices}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto-fill Prices
          </Button>
          <Button onClick={onAddItem} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={item.product.artikelNr}
                  onChange={(e) => {
                    const product = products.find(p => p.artikelNr === e.target.value);
                    if (product) {
                      onUpdateItem(index, {
                        product: {
                          ...product,
                          supplierId: product.supplierId || item.product.supplierId,
                        },
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
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
                  value={item.product.supplierId || ''}
                  onChange={(e) => {
                    onUpdateItem(index, {
                      product: {
                        ...item.product,
                        supplierId: e.target.value,
                      },
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
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

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, { quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EK Price
                </label>
                <EditablePrice
                  value={item.ekPrice}
                  onChange={(value) => onUpdateItem(index, { ekPrice: value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VK Price
                </label>
                <EditablePrice
                  value={item.vkPrice}
                  onChange={(value) => onUpdateItem(index, { vkPrice: value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="px-3 py-2 border rounded-lg bg-gray-50">
                  {formatPrice(item.quantity * item.vkPrice)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <ProfitMarginDisplay
                ekPrice={item.ekPrice}
                vkPrice={item.vkPrice}
                mwst={item.product.mwst}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500">Total Amount</div>
          <div className="text-2xl font-semibold text-gray-900">
            {formatPrice(items.reduce((sum, item) => sum + (item.quantity * item.vkPrice), 0))}
          </div>
        </div>
      </div>
    </div>
  );
}