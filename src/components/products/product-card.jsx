import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProductCard({ product, onSelect, isSimple = false }) {
  const [showSpecs, setShowSpecs] = useState(false);
  const {push} = useRouter()
  return (
    <div className="group relative rounded-lg border bg-white p-2 shadow-sm transition-shadow hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="aspect-square max-h-[250px] w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product?.image}
            alt={product?.imgAlt || product?.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-semibold text-gray-900">{product?.name}</h3>
            {/* <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="rounded-full p-1 hover:bg-gray-100"
              title="View specifications"
            >
              <Info className="h-5 w-5 text-gray-500" />
            </button> */}
          </div>
          <p className="text-sm text-gray-500" >{product?.meta?.description} </p>

          {showSpecs && (
            <div className="rounded-md bg-gray-50 p-3 text-sm">
              <h4 className="font-medium">Specifications:</h4>
              <ul className="mt-1 space-y-1 text-gray-600">
                <li>Type: {product?.type}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {isSimple ?
        <Button
          variant="ghost"
          className="mt-4 w-full justify-between"
          onClick={() => push(`/product/${product.slug}`)}
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button> :
        <div className="pt-3">
          <Button
            onClick={() => onSelect(product)}
            className="w-full text-sm"
            variant="primary"
          >
            Configure Product
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>}
    </div>
  );
}