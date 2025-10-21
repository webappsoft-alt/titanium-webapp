import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "../products/product-grid";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function FeaturedProducts() {
  const { push } = useRouter()
  const menuData = useSelector((state) => state.menu.items);
  const productData = menuData?.filter((item) => (item?.label === "MILL PRODUCTS" || item?.label === "PIPE AND FITTINGS")) || { children: [] };
  const featuredItems = productData
    ?.flatMap(parent => parent.children || [])
    .flatMap(child => child.children || [])
    .filter(item => item?.isFeature);
  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="max-w-xl">
            <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900">
              Featured Specialty Metal Products
            </h2>
            <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
              Explore some of our most requested high-performance metal products. All items are available with full certifications and global shipping.
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
            onClick={() => push("/product")}
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10">
          <ProductGrid products={featuredItems || []} isSimple={true} />
          {/* {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.description}
                </p>
                <Button
                  variant="ghost"
                  className="mt-4 w-full justify-between"
                  onClick={() => push(`/product/${product.id}`)}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))} */}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            className="flex items-center gap-2 underline"
            href={'/product'}
          >
            Browse our full inventory of specialty metal bar, sheet, and fittings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
