import type { Customer } from '../../context/CustomerContext';

const STORAGE_KEY = 'der-stern-customers';

export const getCustomers = (): Customer[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading customers from storage:', error);
    return [];
  }
};

export const saveCustomers = (customers: Customer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers to storage:', error);
  }
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  return getCustomers();
};

export const createCustomer = async (customer: Customer): Promise<void> => {
  const customers = getCustomers();
  saveCustomers([...customers, customer]);
};

export const updateCustomer = async (id: string, customer: Customer): Promise<void> => {
  const customers = getCustomers();
  const updatedCustomers = customers.map(c => c.id === id ? customer : c);
  saveCustomers(updatedCustomers);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(c => c.id !== id);
  saveCustomers(updatedCustomers);
};