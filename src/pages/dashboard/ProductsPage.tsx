import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductList } from './components/ProductList';
import { ProductFilters } from './components/ProductFilters';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/navigation/BackButton';

export function ProductsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
  });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => navigate('/dashboard/products/new')}>
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductFilters filters={filters} setFilters={setFilters} />
      <ProductList filters={filters} />
    </div>
  );
}