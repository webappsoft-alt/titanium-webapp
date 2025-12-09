'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ApiFunction from "@/lib/api/apiFuntions";
import DiscountedTable from "@/components/products/discounted-table";
import SpinnerOverlay from "@/components/ui/spinnerOverlay";
import Select from "react-select";

export function DiscountedProductsPage() {
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
  const [selectedGrade, setSelectedGrade] = useState();
  const [selectedSpecification, setSelectedSpecification] = useState();
  const [selectedPrimaryDim, setSelectedPrimaryDim] = useState();
  const [filterData, setfilterData] = useState(null);

  const { get } = ApiFunction();
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
    setIsLoading(true)
    const urlsData = {
      nameValue: selectedProduct?.value,
    }
    await get('product/product-form', urlsData)
      .then((result) => {
        if (result.success) {
          setProductsForm(result.product)
          // setData(result.product)
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }

  const handleGetFilterProd = async () => {
    setIsLoading(true);
    await get(`discounted-prod/filter`, {
      alloyFamily: selectedProduct?.value || "",
      productForm: selectedProductForm?.label === 'All' ? '' : selectedProductForm?.label || "",
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
      productForm: selectedProductForm?.label === 'All' ? '' : selectedProductForm?.label || "",
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
      handleGetByName()
    }
  }, [
    selectedProduct,
  ]);
  useEffect(() => {
    if (selectedProduct) {
      handleGetFilterProd();
    }
  }, [
    selectedProduct,
    selectedProductForm,
  ]);
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
                  setLastId(1);
                }}
                classNamePrefix="react-select"
              />
            </div>
            {productsForm?.length > 0 && <div>
              <h3 className="text-base font-medium mb-1">
                2. Please Select Product Form
              </h3>
              <Select
                value={{
                  label: selectedProductForm?.label,
                  value: selectedProductForm?.value,
                }}
                options={[
                  { label: "All", value: "" },
                  ...groupedOptions,   // <-- Add grouped options here
                ]}
                onChange={(option) => {
                  setSelectedProductForm(option);
                  setLastId(1);
                }}
                classNamePrefix="react-select"
              />

            </div>}

            {(productsForm?.length > 0 && selectedProduct?.value) && (
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
                  setSelectedGrade("");
                  setSelectedSpecification("");
                  setSelectedPrimaryDim("");
                  setfilterData([]);
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
