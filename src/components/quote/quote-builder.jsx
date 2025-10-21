import { useState } from 'react';
import { useQuoteStore } from '@/store/quote-store';
import { ProductGrid } from '@/components/products/product-grid';
import { QuoteForm } from './quote-form';
import { products } from '@/data/products';

export function QuoteBuilder({ onStepChange }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { items, addItem } = useQuoteStore();

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    onStepChange(2);
  };

  const handleQuoteSubmit = (item) => {
    addItem(item);
    setSelectedProduct(null);
    onStepChange(items.length === 0 ? 3 : 1);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    onStepChange(1);
  };

  return (
    <div className="space-y-8">
      {selectedProduct ? (
        <QuoteForm
          product={selectedProduct}
          onSubmit={handleQuoteSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <ProductGrid
          products={products}
          onSelectProduct={handleProductSelect}
        />
      )}
    </div>
  );
}