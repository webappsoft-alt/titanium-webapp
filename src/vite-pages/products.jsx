'use client'
import { Suspense, useState, } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import SpinnerOverlay from '@/components/ui/spinnerOverlay';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/app/loading';

function ProductsData() {
  const [isLoading, setIsLoading] = useState(false);
  const menuData = useSelector(state => state.menu.items) || []
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const includedLabels = ["MILL PRODUCTS", "PIPE AND FITTINGS"];
  const alloyFamilyFilter = params.get('category') || '';
  const alloyTypeFilter = params.get('type') || '';

  const allProductData = menuData
    ?.filter(item => includedLabels.includes(item?.label))
    ?.flatMap(item => item?.children)
    ?.flatMap(item => item?.children);

  const filteredProducts = allProductData.filter(({ alloyFamily, type }) =>
    (!alloyFamilyFilter || alloyFamily === alloyFamilyFilter) &&
    (!alloyTypeFilter || type === alloyTypeFilter)
  );

  return (
    <>
      <div className="container py-8">
        {isLoading && <SpinnerOverlay />}
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="mt-2 text-gray-600">
              Browse our extensive collection of specialty metals and alloys
            </p>
          </div>
          {alloyFamilyFilter &&
            <div className='flex ms-auto '> <Link href={'/product'} ><Button>Reset</Button></Link>  </div>}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-4">
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const ProductsPage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ProductsData />
      </Suspense>
    </>
  )
}

export default ProductsPage