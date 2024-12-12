import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Upload, Loader, ArrowLeft } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { useSuppliers } from '../../../context/SupplierContext';

const vatRates = [
  { value: 'A', label: 'A (7%)', rate: 7 },
  { value: 'B', label: 'B (19%)', rate: 19 },
];

const countries = [
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Austria',
  'Switzerland',
];

const productGroups = [
  { id: '101', name: 'Backwaren' },
  { id: '102', name: 'Getränke' },
  { id: '103', name: 'Konserven' },
  { id: '104', name: 'Süßwaren' },
  { id: '105', name: 'Tiefkühlkost' },
];

export function EditProductForm() {
  const navigate = useNavigate();
  const { artikelNr } = useParams();
  const { getProduct, updateProduct, isLoading } = useProducts();
  const { suppliers } = useSuppliers();
  
  const [formData, setFormData] = useState({
    artikelNr: '',
    name: '',
    vkPrice: '',
    ekPrice: '',
    mwst: 'A',
    packungArt: '',
    packungInhalt: '',
    istBestand: '',
    ean: '',
    herkunftsland: 'Germany',
    produktgruppe: '101',
    supplierId: '',
    image: null as File | null,
    imagePreview: '',
  });

  useEffect(() => {
    if (artikelNr) {
      const product = getProduct(artikelNr);
      if (product) {
        setFormData({
          ...product,
          vkPrice: product.vkPrice.toString(),
          ekPrice: product.ekPrice.toString(),
          istBestand: product.istBestand.toString(),
          supplierId: product.supplierId || '',
          image: null,
          imagePreview: product.image || '',
        });
      } else {
        navigate('/dashboard/products');
      }
    }
  }, [artikelNr, getProduct, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artikelNr) return;

    try {
      const productData = {
        ...formData,
        artikelNr,
        vkPrice: parseFloat(formData.vkPrice),
        ekPrice: parseFloat(formData.ekPrice),
        istBestand: parseInt(formData.istBestand),
      };

      await updateProduct(artikelNr, productData);
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/dashboard/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Input
                label="Artikel Nr."
                value={formData.artikelNr}
                disabled
                required
              />

              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="VK-Preis €"
                  type="number"
                  step="0.01"
                  value={formData.vkPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, vkPrice: e.target.value }))}
                  required
                />

                <Input
                  label="EK-Preis €"
                  type="number"
                  step="0.01"
                  value={formData.ekPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, ekPrice: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MwSt %
                </label>
                <select
                  value={formData.mwst}
                  onChange={(e) => setFormData(prev => ({ ...prev, mwst: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {vatRates.map(rate => (
                    <option key={rate.value} value={rate.value}>
                      {rate.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="space-y-6">
              <Input
                label="Packung Art Colli"
                value={formData.packungArt}
                onChange={(e) => setFormData(prev => ({ ...prev, packungArt: e.target.value }))}
                required
              />

              <Input
                label="Packung Gebinde Inhalt"
                value={formData.packungInhalt}
                onChange={(e) => setFormData(prev => ({ ...prev, packungInhalt: e.target.value }))}
                placeholder="e.g., 12 x 250 g"
                required
              />

              <Input
                label="Ist Bestand"
                type="number"
                value={formData.istBestand}
                onChange={(e) => setFormData(prev => ({ ...prev, istBestand: e.target.value }))}
                required
              />

              <Input
                label="EAN"
                value={formData.ean}
                onChange={(e) => setFormData(prev => ({ ...prev, ean: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Herkunftsland
              </label>
              <select
                value={formData.herkunftsland}
                onChange={(e) => setFormData(prev => ({ ...prev, herkunftsland: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produktgruppe
              </label>
              <select
                value={formData.produktgruppe}
                onChange={(e) => setFormData(prev => ({ ...prev, produktgruppe: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {productGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.id} - {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Product Image</h2>
          
          <div className="flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex justify-center">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Product preview"
                    className="max-w-xs h-auto rounded-lg shadow"
                  />
                ) : (
                  <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Upload product image</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Choose Image
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/dashboard/products')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}