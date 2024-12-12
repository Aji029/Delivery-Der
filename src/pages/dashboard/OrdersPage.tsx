import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { OrderList } from './components/OrderList';
import { SupplierFilter } from '../../components/SupplierFilter';
import { TodaysPicks } from '../../features/suppliers/components/TodaysPicks';
import { BackButton } from '../../components/navigation/BackButton';
import { EndDayModal } from './components/EndDayModal';

export function OrdersPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDayModal, setShowEndDayModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Filter by Date
            </Button>
            
            {showDatePicker && (
              <div className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowEndDayModal(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            End Day
          </Button>

          <Button onClick={() => navigate('/dashboard/orders/new')}>
            <Plus className="h-5 w-5 mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      <TodaysPicks fromOrders={true} />

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <SupplierFilter
          selectedSupplierId={selectedSupplierId}
          onSupplierChange={setSelectedSupplierId}
        />
      </div>
      
      <OrderList
        selectedDate={selectedDate}
        selectedSupplierId={selectedSupplierId}
      />

      <EndDayModal
        isOpen={showEndDayModal}
        onClose={() => setShowEndDayModal(false)}
      />
    </div>
  );
}