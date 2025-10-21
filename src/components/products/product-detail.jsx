'use client'
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectOption } from "../ui/select";
import { Label } from "../ui/label";
import { FormFeedback } from "../ui/formFeedBack";
import ApiFunction from "@/lib/api/apiFuntions";
import SpinnerOverlay from "../ui/spinnerOverlay";
import QuotationTable from "./quote-table";
import { generateNewUniqueID, generateUniqueID } from "@/lib/api/encrypted";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams, usePathname, useRouter } from "next/navigation";

const ProductDetail = () => {
  const { get, post } = ApiFunction();
  const state = null;
  // const product = state
  const { id } = useParams();
  const { push } = useRouter();
  const userData = useSelector((state) => state.auth.userData);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [productData, setProductData] = useState(null);
  const [tabelsData, setTabelsData] = useState([]);
  const [favoriteData, setFavoriteData] = useState([]);
  const [product, setProduct] = useState(null);
  const [gradeAlloyOption, setGradeAlloyOption] = useState([]);
  const [specificationOption, setSpecificationOption] = useState([]);
  const [primaryDimensionOption, setPrimaryDimensionOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTransform, setIsLoadingTransform] = useState(false);
  const quoteSchema = z.object({
    grade: z.string().min(0, "Please select a grade"),
    specifications: z.string().min(0, "Please select specifications"),
    primaryDimension: z.string().min(0, "Please enter primary dimension"),
  });

  const transformData = async (data, alloyFamily) => {
    setIsLoadingTransform(true);
    let transformedArray = [];
    data.grades.forEach((grade) => {
      grade.specifications.forEach((spec) => {
        spec.primaryDimension.forEach((dimension) => {
          transformedArray.push({
            alloyFamily,
            productForm: data.product,
            uom: "lb",
            grade: grade.gradeAlloy,
            specifications: spec.specification,
            primaryDimension: dimension,
            length: "",
            type: data?.type,
            lengthTolerance: "",
            primaryDimTol: "",
            identifier: "",
            available_quantity: 0,
            prices: {
              priceLabel: "",
              price: "",
            },
          });
        });
      });
    });
    // generateNewUniqueID()
    let transformWithID = transformedArray.map((item) => ({
      ...item,
      uniqueID: generateNewUniqueID(item),
      id: generateUniqueID(),
    }));
    await post("tolerance/byIds", {
      id: transformWithID?.map((item) => item.uniqueID),
    })
      .then(async (result) => {
        if (result.success) {
          const nData = result?.tolerances?.map((item) => ({
            uniqueID: item?.uniqueID,
            length: item?.tolerance?.find((tol) => tol?.label === "Length")
              ?.value
              ? Number(
                item.tolerance.find((tol) => tol?.label === "Length")?.value
              ).toFixed(2) + `"`
              : "",
            lengthTolerance: item?.tolerance?.find(
              (tol) => tol?.label === "Length Tolerance"
            )?.value
              ? Number(
                item.tolerance.find(
                  (tol) => tol?.label === "Length Tolerance"
                )?.value
              ).toFixed(2) + `"`
              : "",
            primaryDimTol: item?.tolerance?.find(
              (tol) => tol.label === "Primary Dim 1 Tolerance"
            )?.value
              ? item.tolerance.find(
                (tol) => tol.label === "Primary Dim 1 Tolerance"
              )?.value + `"`
              : "",
          }));

          const allUpdated = transformWithID.map((element) => {
            const filterData = nData.find(
              (item) => item.uniqueID === element.uniqueID
            );
            return filterData ? { ...element, ...filterData } : element;
          });
          transformWithID = [...allUpdated];
          setTabelsData(allUpdated);
        } else {
          setTabelsData(transformWithID);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoadingTransform(false));
    return transformWithID;
  };
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      grade: "",
      specifications: "",
      primaryDimension: "",
    },
  });
  const onSubmit = async (data) => {
    if (!isLogin) {
      push("/auth/login");
      toast.error("Sign in required");
      return;
    }
    let nProdData = productData?.products?.find(
      (item) => item.product === product?.alloyType
    );
    let tableData = { ...nProdData }; // Keeps a separate copy for table data

    // If grade is selected, filter by grade
    if (data?.grade) {
      nProdData = {
        ...nProdData,
        grades: [nProdData?.grades?.find((item) => item._id === data?.grade)],
      };
      tableData = { ...nProdData };
    }

    // If specification is selected (without grade), filter the relevant grade(s)
    if (data?.specifications) {
      let filteredGrades = nProdData?.grades
        ?.map((grade) => {
          let filteredSpecs = grade.specifications.filter(
            (spec) => spec._id === data?.specifications
          );
          if (filteredSpecs.length) {
            return { ...grade, specifications: filteredSpecs };
          }
          return null;
        })
        .filter(Boolean); // Remove null values

      nProdData = { ...nProdData, grades: filteredGrades };
      tableData = { ...nProdData };
    }

    // If primaryDimension is selected, filter based on specification and dimension
    if (data?.primaryDimension) {
      const [primaryDimensionSpec, primaryDimension] =
        data?.primaryDimension.split("____");

      // **Maintain all related options while filtering**
      let relatedGrades = nProdData?.grades
        ?.map((grade) => {
          let relatedSpecs = grade.specifications.filter(
            (spec) => spec._id === primaryDimensionSpec
          );
          if (relatedSpecs.length) {
            return { ...grade, specifications: relatedSpecs };
          }
          return null;
        })
        .filter(Boolean);

      // **Apply strict filtering for table display (specific dimension)**
      let filteredGrades = relatedGrades
        ?.map((grade) => {
          let filteredSpecs = grade.specifications
            .map((spec) => {
              if (spec._id === primaryDimensionSpec) {
                let filteredDimensions = spec.primaryDimension.filter(
                  (dim) => dim === primaryDimension
                );
                if (filteredDimensions.length) {
                  return { ...spec, primaryDimension: filteredDimensions };
                }
              }
              return null;
            })
            .filter(Boolean);

          if (filteredSpecs.length) {
            return { ...grade, specifications: filteredSpecs };
          }
          return null;
        })
        .filter(Boolean);

      // **Keep `nProdData` with all related options but `tableData` filtered for strict view**
      nProdData = { ...nProdData, grades: relatedGrades };
      tableData = { ...nProdData, grades: filteredGrades };
    }
    handleOptions({ ...nProdData, type: productData?.type }); // Maintain all related options
    transformData(
      { ...tableData, type: productData?.type },
      productData?.alloyFamily
    ); // Strict filtering for table display
  };

  const handleOptions = (data = []) => {
    // Find the matching product based on alloyType
    const matchedProduct = { ...data };

    // Extract grade alloy options
    const gradeAlloyOp =
      matchedProduct?.grades?.map((item) => ({
        value: item._id,
        label: item.gradeAlloy,
        ...item,
      })) || [];

    // Extract specifications and structure them properly
    const specificationOp = gradeAlloyOp
      .flatMap((item) => item.specifications || [])
      .map((spec) => ({
        value: spec._id,
        label: spec.specification,
        ...spec,
      }));
    // Extract primaryDimension from specifications while including the corresponding `value` from specificationOp
    const primaryDimensionOp = specificationOp.flatMap((spec) =>
      (spec.primaryDimension || []).map((dim) => ({
        value: spec._id, // Keep reference to the specification ID
        label: dim, // The primaryDimension value
      }))
    );
    setGradeAlloyOption(gradeAlloyOp);
    setSpecificationOption(specificationOp);
    setPrimaryDimensionOption(primaryDimensionOp);
  };
  const handleGetById = async (id) => {
    setIsLoading(true);
    await get(`product/byId/${id}`)
      .then((result) => {
        if (result.success) {
          setProductData(result.product);
        }
      })
      .catch((err) => { })
      .finally(() => setIsLoading(false));
  };
  const handleGetProductDataById = async (id) => {
    setIsLoading(true);
    await get(`prod-data/byId/${id}`)
      .then((result) => {
        if (result.success) {
          setProduct(result.productData);
          handleGetById(result?.productData?.product);
        }
      })
      .catch((err) => { })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (state) {
      setProduct(state);
      handleGetById(state?.product);
    } else {
      handleGetProductDataById(id);
    }
  }, [id]);
  useEffect(() => {
    if (product && productData) {
      handleOptions(
        productData?.products?.find(
          (item) => item.product === product?.alloyType
        )
      );
    }
  }, [product, productData]);
  const handleGetFavoriteProducts = useCallback(async () => {
    setIsLoadingTransform(true)
    await get(`favorite/${product?._id}`)
      .then((result) => {
        setFavoriteData(result?.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoadingTransform(false)
      })
  }, [product])
  useEffect(() => {
    if (product) {
      handleGetFavoriteProducts()
    }
  }, [product]);
  return (
    <>
      <div className="container px-2 py-8 ">
        {(isLoadingTransform || isLoading) && <SpinnerOverlay />}
        <div className="">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Image */}
            <div className="space-y-6 ">
              <h1 className="text-2xl font-semibold text-gray-900">
                {product?.name}
              </h1>
              <div className=" w-full  object-contain rounded-lg ">
                <img
                  src={product?.image}
                  alt={product?.imgAlt || product?.name}
                  className="max-h-40 object-contain object-left"
                />
              </div>
              <div
                className="prose prose-sm text-sm text-gray-600 innerData"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              />
            </div>

            {/* Right side - Content */}
            <div className="space-y-4">
              <h6>Please make your selection. Results will appear below.</h6>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="capitalize">GRADE/ALLOY</Label>
                  <Controller
                    name="grade"
                    disabled={""}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        aria-invalid={!!errors.grade}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("specifications", "");
                          setValue("primaryDimension", "");
                        }}
                      >
                        <SelectOption value="">All</SelectOption>
                        {gradeAlloyOption?.map((item, index) => (
                          <SelectOption key={index} value={item?.value}>
                            {item?.label}
                          </SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.grade && (
                    <FormFeedback>{errors.grade.message}</FormFeedback>
                  )}
                </div>
                <div>
                  <Label className="capitalize">SPECIFICATIONS</Label>
                  <Controller
                    name="specifications"
                    control={control}
                    disabled={""}
                    render={({ field }) => (
                      <Select
                        aria-invalid={!!errors.specifications}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("primaryDimension", "");
                        }}
                        {...field}
                      >
                        <SelectOption value="">All</SelectOption>
                        {specificationOption?.map((item, index) => (
                          <SelectOption key={index} value={item?.value}>
                            {item?.label}
                          </SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.specifications && (
                    <FormFeedback>{errors.specifications.message}</FormFeedback>
                  )}
                </div>
                <div>
                  <Label className="capitalize">PRIMARY DIMENSION</Label>
                  <Controller
                    name="primaryDimension"
                    control={control}
                    disabled={""}
                    render={({ field }) => (
                      <Select
                        aria-invalid={!!errors.primaryDimension}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        {...field}
                      >
                        <SelectOption value="">All</SelectOption>
                        {primaryDimensionOption?.map((item, index) => (
                          <SelectOption
                            key={index}
                            value={`${item?.value}____${item?.label}`}
                          >
                            {item?.label}
                          </SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.primaryDimension && (
                    <FormFeedback>{errors.primaryDimension.message}</FormFeedback>
                  )}
                </div>
                <div className="w-full flex gap-4">
                  <Button type="submit" className="w-full mb-3">
                    Show All
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setValue("grade", "");
                      setValue("primaryDimension", "");
                      setValue("specifications", "");
                      handleOptions(
                        productData?.products?.find(
                          (item) => item.product === product?.alloyType
                        )
                      );
                    }}
                    className="w-full mb-3"
                  >
                    Reset Filter
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {!isLoadingTransform && (
          <div className="mt-3">
            <QuotationTable tablesData={tabelsData} productId={product?._id} setTabelsData={setTabelsData} setFavoriteData={setFavoriteData} favoriteData={favoriteData} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
