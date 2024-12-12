import React from 'react';
import { Factory } from 'lucide-react';
import { formatDateForDisplay } from '../../../utils/dateFormatting';
import { useSupplierStats } from '../hooks/useSupplierStats';
import { SupplierCard } from './SupplierCard';

interface TodaysPicksProps {
  fromOrders?: boolean;
}

export function TodaysPicks({ fromOrders = true }: TodaysPicksProps) {
  const today = new Date();
  const supplierStats = useSupplierStats(today);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center text-gray-900">
          <Factory className="h-5 w-5 mr-2 text-gray-500" />
          Today's Picks ({formatDateForDisplay(today)})
        </h2>
      </div>

      {supplierStats.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No orders for today</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supplierStats.map(supplier => (
            <SupplierCard 
              key={supplier.id} 
              supplier={supplier} 
              fromOrders={true} // Always true since TodaysPicks is only used in Orders context
            />
          ))}
        </div>
      )}
    </div>
  );
}