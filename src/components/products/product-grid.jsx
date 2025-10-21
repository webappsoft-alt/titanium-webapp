import { useRouter } from 'next/navigation';
import { ProductCard } from './product-card';

export function ProductGrid({ products, onSelectProduct, isSimple = false }) {
  const { push } = useRouter()
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          isSimple={isSimple}
          product={product}
          onSelect={() => push(`/product/${product?.slug}`)}
        />
      ))}
    </div>
  );
}