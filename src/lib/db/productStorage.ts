import type { Product } from '../../context/ProductContext';

const STORAGE_KEY = 'der-stern-products';

export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading products from storage:', error);
    return [];
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to storage:', error);
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  return getProducts();
};

export const createProduct = async (product: Omit<Product, 'image'> & { image: File | null }): Promise<void> => {
  const products = getProducts();
  const imageUrl = product.image ? URL.createObjectURL(product.image) : null;
  const newProduct = { ...product, image: imageUrl };
  saveProducts([...products, newProduct]);
};

export const updateProduct = async (artikelNr: string, product: Omit<Product, 'image'> & { image: File | null }): Promise<void> => {
  const products = getProducts();
  const existingProduct = products.find(p => p.artikelNr === artikelNr);
  
  let imageUrl = existingProduct?.image || null;
  if (product.image instanceof File) {
    imageUrl = URL.createObjectURL(product.image);
  }

  const updatedProducts = products.map(p => 
    p.artikelNr === artikelNr 
      ? { 
          ...product,
          image: imageUrl,
          vkPrice: Number(product.vkPrice),
          ekPrice: Number(product.ekPrice),
          istBestand: Number(product.istBestand)
        } 
      : p
  );
  
  saveProducts(updatedProducts);
};

export const deleteProduct = async (artikelNr: string): Promise<void> => {
  const products = getProducts();
  const updatedProducts = products.filter(p => p.artikelNr !== artikelNr);
  saveProducts(updatedProducts);
};