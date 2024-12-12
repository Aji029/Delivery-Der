import type { Supplier } from '../../context/SupplierContext';

const STORAGE_KEY = 'der-stern-suppliers';

export const getSuppliers = (): Supplier[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading suppliers from storage:', error);
    return [];
  }
};

export const saveSuppliers = (suppliers: Supplier[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
  } catch (error) {
    console.error('Error saving suppliers to storage:', error);
  }
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  return getSuppliers();
};

export const createSupplier = async (supplier: Supplier): Promise<void> => {
  const suppliers = getSuppliers();
  saveSuppliers([...suppliers, supplier]);
};

export const updateSupplier = async (id: string, supplier: Supplier): Promise<void> => {
  const suppliers = getSuppliers();
  const updatedSuppliers = suppliers.map(s => s.id === id ? supplier : s);
  saveSuppliers(updatedSuppliers);
};

export const deleteSupplier = async (id: string): Promise<void> => {
  const suppliers = getSuppliers();
  const updatedSuppliers = suppliers.filter(s => s.id !== id);
  saveSuppliers(updatedSuppliers);
};