"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import ApiFunction from "@/lib/api/apiFuntions";
import DiscountedTable from "@/components/products/discounted-table";
import SpinnerOverlay from "@/components/ui/spinnerOverlay";
import Select from "react-select";

export function DiscountedProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userData = useSelector((state) => state.auth.userData);
  const [count, setCount] = useState(null);
  const [lastId, setLastId] = useState(1);
  const [tabelsData, setTabelsData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isLoadingTransform, setIsLoadingTransform] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productsForm, setProductsForm] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState({
    label: "All",
    value: "",
  });
  const [selectedProductForm, setSelectedProductForm] = useState({
    label: "All",
    value: "",
  });
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSpecification, setSelectedSpecification] = useState("");
  const [selectedPrimaryDim, setSelectedPrimaryDim] = useState("");
  const [filterData, setfilterData] = useState(null);

  const { get } = ApiFunction();

  // Check if user is not logged in and redirect from /customer path
  useEffect(() => {
    if (!userData && pathname.includes("/customer/")) {
      const queryString = searchParams.toString();
      const publicPath = "/discounted-products";
      // Store the intended URL in sessionStorage for redirect after login
      if (queryString) {
        sessionStorage.setItem(
          "redirectAfterLogin",
          `${pathname}?${queryString}`
        );
      }
      router.push(queryString ? `${publicPath}?${queryString}` : publicPath);
    }
  }, [userData, pathname, searchParams, router]);

  // Update URL with query parameters
  const updateUrlParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.product?.value) params.append("product", filters.product.value);
    if (filters.productForm?.label !== "All" && filters.productForm?.label) {
      params.append("form", filters.productForm.label);
    }
    if (filters.grade) params.append("grade", filters.grade);
    if (filters.specification) params.append("spec", filters.specification);
    if (filters.dimension) params.append("dim", filters.dimension);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
  };

  // Load filters from URL on mount
  useEffect(() => {
    const product = searchParams.get("product");
    const form = searchParams.get("form");
    const grade = searchParams.get("grade");
    const spec = searchParams.get("spec");
    const dim = searchParams.get("dim");

    if (product) {
      setSelectedProduct({ label: product, value: product });
    }
    if (form) {
      setSelectedProductForm({ label: form, value: form });
    }
    if (grade) {
      setSelectedGrade(grade);
    }
    if (spec) {
      setSelectedSpecification(spec);
    }
    if (dim) {
      setSelectedPrimaryDim(dim);
    }
  }, []);

  const groupedOptions = productsForm?.map((item) => ({
    label:
      item?.type === "mill-product"
        ? "Mill Product"
        : item?.type === "pipe-fitting"
        ? "Pipe & Fittings"
        : "Margin Guidelines",

    options: item?.products?.map((p) => ({
      label: p.product,
      value: p._id,
    })),
  }));

  const handleGetProduct = async () => {
    setIsLoading(true);
    await get(`product/alloy-family`)
      .then((result) => {
        setProductData(result?.alloyFamilies);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };
  const handleGetByName = async () => {
    setIsLoading(true);
    const urlsData = {
      nameValue: selectedProduct?.value,
    };
    await get("product/product-form", urlsData)
      .then((result) => {
        if (result.success) {
          setProductsForm(result.product);
          // setData(result.product)
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleGetFilterProd = async () => {
    setIsLoading(true);
    await get(`discounted-prod/filter`, {
      alloyFamily: selectedProduct?.value || "",
      productForm:
        selectedProductForm?.label === "All"
          ? ""
          : selectedProductForm?.label || "",
      // specifications: selectedSpecification || "",
      // gradeAlloy: selectedGrade || "",
      // primaryDimension: selectedPrimaryDim || "",
    })
      .then((result) => {
        setfilterData(result?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };
  const handleGetDiscounded = async (pageNo = 1) => {
    setIsLoadingTransform(true);
    await get(`discounted-prod/all/${pageNo}`, {
      alloyFamily: selectedProduct?.value || "",
      productForm:
        selectedProductForm?.label === "All"
          ? ""
          : selectedProductForm?.label || "",
      specifications: selectedSpecification || "",
      gradeAlloy: selectedGrade || "",
      primaryDimension: selectedPrimaryDim || "",
    })
      .then((result) => {
        setTabelsData(result?.products);
        setCount(result?.count);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoadingTransform(false));
  };
  useEffect(() => {
    handleGetProduct();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      handleGetByName();
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (selectedProduct) {
      handleGetFilterProd();
    }
  }, [selectedProduct, selectedProductForm]);
  useEffect(() => {
    handleGetDiscounded(lastId);
  }, [
    lastId,
    selectedProduct,
    selectedProductForm,
    selectedSpecification,
    selectedPrimaryDim,
    selectedGrade,
  ]);

  const productOptions =
    productData?.map((item) => ({ label: item, value: item })) || [];
  const gradeAlloyOptions =
    filterData?.gradeAlloy?.map((item) => ({ label: item, value: item })) || [];
  const specificationsOptions =
    filterData?.specifications?.map((item) => ({ label: item, value: item })) ||
    [];
  const primaryDimensionOptions =
    filterData?.primaryDimension?.map((item) => ({
      label: item,
      value: item,
    })) || [];
  return (
    <div className="flex-1 bg-white">
      {(isLoading || isLoadingTransform) && <SpinnerOverlay />}
      <div className=" mx-auto md:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">Discounted Products</h1>

        {/* Product Selection Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 max-sm:px-2 mb-8">
          <div className="flex gap-8 items-center flex-wrap">
            <div>
              <img
                src="https://shop.titanium.com/spree/products/19/product/Rec_Bar_Hi.png?1580232799"
                alt="Product Selection"
                className=" max-w-sm object-contain"
              />
            </div>
            <div className="max-w-md">
              <p className="text-gray-600 mb-6">
                Here are the products we currently have in stock at a discounted
                price. Please use the Product filter to narrow down our
                catalogue.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 space-y-3 bg-gray-50 rounded-lg border border-gray-200">
            {/* Product Selection */}
            <div>
              <h3 className="text-base font-medium mb-1">
                1. Please Select Product
              </h3>
              <Select
                value={{
                  label: selectedProduct?.label,
                  value: selectedProduct?.value,
                }}
                options={[{ label: "All", value: "" }, ...productOptions]}
                onChange={(option) => {
                  setSelectedProduct(option);
                  setSelectedProductForm({ label: "All", value: "" });
                  setLastId(1);
                  updateUrlParams({
                    product: option,
                    productForm: { label: "All", value: "" },
                    grade: "",
                    specification: "",
                    dimension: "",
                  });
                }}
                classNamePrefix="react-select"
              />
            </div>
            {productsForm?.length > 0 && (
              <div>
                <h3 className="text-base font-medium mb-1">
                  2. Please Select Product Form
                </h3>
                <Select
                  value={{
                    label: selectedProductForm?.label,
                    value: selectedProductForm?.value,
                  }}
                  options={[{ label: "All", value: "" }, ...groupedOptions]}
                  onChange={(option) => {
                    setSelectedProductForm(option);
                    setLastId(1);
                    updateUrlParams({
                      product: selectedProduct,
                      productForm: option,
                      grade: selectedGrade,
                      specification: selectedSpecification,
                      dimension: selectedPrimaryDim,
                    });
                  }}
                  classNamePrefix="react-select"
                />
              </div>
            )}

            {productsForm?.length > 0 && selectedProduct?.value && (
              <>
                {/* Grade or Alloy Selection */}
                <div>
                  <h3 className="text-base font-medium mb-1">
                    3. Please Select Grade or Alloy
                  </h3>
                  <Select
                    value={{
                      label: selectedGrade || "All",
                      value: selectedGrade || "",
                    }}
                    options={[
                      { label: "All", value: "" },
                      ...gradeAlloyOptions,
                    ]}
                    onChange={(option) => {
                      setSelectedGrade(option.value);
                      setLastId(1);
                      updateUrlParams({
                        product: selectedProduct,
                        productForm: selectedProductForm,
                        grade: option.value,
                        specification: selectedSpecification,
                        dimension: selectedPrimaryDim,
                      });
                    }}
                    classNamePrefix="react-select"
                  />
                </div>

                {/* Specification Selection */}
                <div>
                  <h3 className="text-base font-medium mb-1">
                    4. Please Select Specification
                  </h3>
                  <Select
                    value={{
                      label: selectedSpecification || "All",
                      value: selectedSpecification || "",
                    }}
                    options={[
                      { label: "All", value: "" },
                      ...specificationsOptions,
                    ]}
                    onChange={(option) => {
                      setSelectedSpecification(option.value);
                      setLastId(1);
                      updateUrlParams({
                        product: selectedProduct,
                        productForm: selectedProductForm,
                        grade: selectedGrade,
                        specification: option.value,
                        dimension: selectedPrimaryDim,
                      });
                    }}
                    classNamePrefix="react-select"
                  />
                </div>

                {/* Primary Dimension Selection */}
                <div>
                  <h3 className="text-base font-medium mb-1">
                    5. Please Select Primary Dimension (Diameter, Thickness,
                    etc.)
                  </h3>
                  <Select
                    value={{
                      label: selectedPrimaryDim || "All",
                      value: selectedPrimaryDim || "",
                    }}
                    options={[
                      { label: "All", value: "" },
                      ...primaryDimensionOptions,
                    ]}
                    onChange={(option) => {
                      setSelectedPrimaryDim(option.value);
                      setLastId(1);
                      updateUrlParams({
                        product: selectedProduct,
                        productForm: selectedProductForm,
                        grade: selectedGrade,
                        specification: selectedSpecification,
                        dimension: option.value,
                      });
                    }}
                    classNamePrefix="react-select"
                  />
                </div>
              </>
            )}

            {/* Reset Filters */}
            <div>
              <Button
                className="whitespace-nowrap"
                onClick={() => {
                  setSelectedProduct({ label: "All", value: "" });
                  setSelectedProductForm({ label: "All", value: "" });
                  setSelectedGrade("");
                  setSelectedSpecification("");
                  setSelectedPrimaryDim("");
                  setfilterData([]);
                  router.push(pathname);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
        <DiscountedTable
          setLastId={setLastId}
          tablesData={tabelsData}
          setTabelsData={setTabelsData}
          totalItems={count?.totalCount || 0}
          totalPages={count?.totalPage || 0}
        />
      </div>
    </div>
  );
}
