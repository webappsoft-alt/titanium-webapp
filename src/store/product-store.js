import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create()(
  persist(
    (set, get) => ({
      products: [],
      addProducts: (newProducts) =>
        set((state) => {
          const existingProducts = new Map(
            state.products.map(p => [p.id, p])
          );
          
          newProducts.forEach(product => {
            existingProducts.set(product.id, {
              ...product,
              specifications: {
                grades: product.specifications?.grades || ['Standard'],
                dimensions: product.specifications?.dimensions || [{
                  min: 0,
                  max: 0,
                  unit: 'inches'
                }]
              },
              pricing: {
                basePrice: product.pricing?.basePrice || 0,
                volumePricing: product.pricing?.volumePricing || [],
                unit: product.pricing?.unit || 'EA'
              },
              inventory: {
                quantity: product.inventory?.quantity || 0,
                sku: product.inventory?.sku || '',
                location: product.inventory?.location || ''
              }
            });
          });
          
          return {
            products: Array.from(existingProducts.values())
          };
        }),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map(p =>
            p.id === id ? { ...p, ...updates } : p
          )
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        })),
      addVariant: (productId, variant) =>
        set((state) => ({
          products: state.products.map(p =>
            p.id === productId
              ? { ...p, variants: [...(p.variants || []), variant] }
              : p
          )
        })),
      updateVariant: (productId, variantId, updates) =>
        set((state) => ({
          products: state.products.map(p =>
            p.id === productId
              ? {
                  ...p,
                  variants: p.variants?.map(v =>
                    v.id === variantId ? { ...v, ...updates } : v
                  )
                }
              : p
          )
        })),
      deleteVariant: (productId, variantId) =>
        set((state) => ({
          products: state.products.map(p =>
            p.id === productId
              ? {
                  ...p,
                  variants: p.variants?.filter(v => v.id !== variantId)
                }
              : p
          )
        })),
      clearProducts: () => set({ products: [] }),
      getProduct: (id) => get().products.find(p => p.id === id),
      getProductsByCategory: (category) =>
        get().products.filter(p => p.category === category),
      getProductVariants: (productId) => {
        const product = get().products.find(p => p.id === productId);
        return product?.variants || [];
      },
    }),
    {
      name: 'product-storage',
    }
  )
);