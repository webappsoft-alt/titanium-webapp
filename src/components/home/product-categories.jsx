import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ApiFunction from "@/lib/api/apiFuntions";
import { useEffect, useState } from "react";
import CategoryGrid from "./categoryGrid";

export function ProductCategories() {
  const { push } = useRouter()
  const alloyFamilies = useSelector((state) => state.prod.metalType);
  const menuData = useSelector((state) => state.menu.items);
  const { get, } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [categoryInformation, setcategoryInformation] = useState([]);
  const productData = menuData?.find(
    (item) => (item?.label === "MILL PRODUCTS" || item?.label === "PIPE AND FITTINGS")
  ) || { children: [] };
  const pipeAllData = menuData?.find(
    (item) => item?.label === "PIPE AND FITTINGS"
  ) || { children: [] };

  const materials = [
    {
      name: "Titanium",
      description: "Including titanium round bar, sheet, plate, and pipe fittings for aerospace, medical, and defense"
    },
    {
      name: "Stainless Steel",
      description: "Featuring stainless steel round bar, plate, and rod including 303, 430, 440c, and 17-4 stainless steel"
    },
    {
      name: "Nickel Alloy",
      description: "Nickel round bar, nickel alloy rod, and bar stock available for corrosion-resistant and high-temp applications"
    },
    {
      name: "Alloy Steel",
      description: "4130, 4140, and 4340 alloy steel round bar and bar stock for structural and tooling use"
    },
    {
      name: "Cobalt Chrome Moly",
      description: "Cobalt chrome round bar and moly-based materials for medical and industrial precision components"
    },
    {
      name: "Carbon Steel",
      description: "General purpose steel in various grades and forms"
    },
    {
      name: "Aluminum",
      description: "Lightweight bar and plate options for aerospace and industrial use"
    },
    {
      name: "Pipe & Fittings",
      description: "Titanium pipe fittings including tees, elbows, reducers, stub ends, and flanges"
    }
  ];


  const handleGet = async () => {
    setIsLoading(true)
    await get(`category/all`)
      .then((result) => {
        if (result) {
          setcategoryInformation(result.categories)
        }
      }).catch((err) => {
      }).finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleGet()
  }, []);


  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Metal Categories */}
        <div className="mb-16">
          <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Explore Our Specialty Metal Categories
          </h2>
          <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600">
            As a global multi-alloy distributor, Titanium Industries offers a comprehensive range of metal materials and product forms for high-performance applications.
          </p>
          <CategoryGrid categoryInformation={categoryInformation} productData={productData}  /> 

          {/* <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {productData?.children?.map((category) => (
              <div
                key={category?.label}
                className="group relative flex flex-col justify-between rounded-lg border bg-white p-6 pb-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category?.label}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {categoryInformation?.find(item => item?.name === category?.label)?.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className=" w-full  justify-between"
                  onClick={() =>
                    push(
                      `/product?category=${category?.label}`
                    )
                  }
                >
                  <img src={categoryInformation?.find(item => item?.name === category?.label)?.image} width={50} height={'auto'} alt="" />
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div> */}
        </div>

        {/* Pipe and Fittings */}
        {/* <div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
            Pipe and Fittings
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pipeFitting?.map((fitting) => (
              <div
                key={fitting?.slug}
                className="group relative rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={fitting?.image}
                    alt={fitting?.label}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {fitting?.label}
                  </h3>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full justify-between"
                    onClick={() =>
                      push(
                        fitting?.slug
                          ? `/product/${fitting.slug}`
                          : fitting?.path
                      )
                    }
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
