'use client'
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Select, SelectOption } from "../ui/select";
import ApiFunction from "@/lib/api/apiFuntions";
import { Fragment, useCallback, useEffect, useState } from "react";
import SpinnerOverlay from "../ui/spinnerOverlay";
import { Input } from "../ui/input";
import { FormFeedback } from "../ui/formFeedBack";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeTableData,
  setMetalType,
  setTableData,
  updateTableData,
} from "@/lib/redux/products";
import { generateNewUniqueID, increasePrice } from "@/lib/api/encrypted";
import { calculateWeightWithoutHTML, customCutFormula, getLogicValue, sortCustomValues, UomOptions } from "../tools/calculator/utils";
import { newMetalFamily } from "@/lib/utils/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { handleError } from "@/lib/api/errorHandler";
import QuotationPDFTemplate from "../admin/quote-pdf-template";
import { pdf, } from '@react-pdf/renderer';

const priceRanges = [
  { min: 0, max: 1 },
  { min: 1.01, max: 2 },
  { min: 2.01, max: 3 },
  { min: 3.01, max: 4 },
  { min: 4.01, max: 5 },
  { min: 5.01, max: 10 },
  { min: 10.01, max: 20 },
  { min: 20.01, max: 30 },
  { min: 30.01, max: 40 },
  { min: 40.01, max: 50 },
  { min: 50.01, max: 75 },
  { min: 75.01, max: 100 },
  { min: 100.01, max: 125 },
  { min: 125.01, max: 150 },
  { min: 150.01, max: 200 },
  { min: 200.01, max: 300 },
  { min: 300.01, max: 400 },
  { min: 400.01, max: 500 },
  { min: 500.01, max: 600 },
  { min: 600.01, max: 700 },
  { min: 700.01, max: 800 },
  { min: 800.01, max: 900 },
  { min: 900.01, max: 1000 },
  { min: 1000.01, max: 2500 },
];

export function QuoteForm() {
  const { get, post, put, deleteData, header2 } = ApiFunction();
  const competMarkup = useSelector((state) => state.prod.competMarkup);
  const [activeTab, setActiveTab] = useState('stock');
  const dispatch = useDispatch();
  const alloyFamilies = useSelector((state) => state.prod.metalType);
  const userData = useSelector((state) => state.auth.userData);
  const tableData = useSelector((state) => state.prod.tableData);
  const [products, setProducts] = useState([]);
  const [grades, setGrades] = useState([]);
  const { push } = useRouter()
  const [toleranceData, setToleranceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [quantityData, setQuantityData] = useState({});
  const [notes, setNotes] = useState("");
  const [tolData, setTolData] = useState([]);
  const [calData, setCalData] = useState([]);
  const quoteSchema = z.object({
    alloyFamily: z.string().min(1, "Please select a metal type"),
    productForm: z.string().min(1, "Please select a product form"),
    grade: z.string().min(1, "Please select a grade"),
    specifications: z.string().min(1, "Please select specifications"),
    primaryDimension: z.string().min(1, "Please enter primary dimension"),
    quantity: activeTab !== 'stock' ? z.string().optional() : z.string().min(1, "Quantity must be at least 1"),
    customQuantity: activeTab === 'stock' ? z.string().optional() : z.string().min(1, "Quantity must be at least 1"),
    cutLength: activeTab === 'stock' ? z.string().optional() : z.string().min(1, "Custom cut must be at least 1"),
    cutWidth: z.string().optional(),
    uom:
      (grades?.[0]?.type === "pipe-fitting" || activeTab !== 'stock')
        ? z.string().optional()
        : z.string().min(1, "Please select a unit of measure"),
  });
  const {
    control,
    register,
    setValue,
    reset,
    watch,
    clearErrors,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      alloyFamily: "",
      productForm: "",
      grade: "",
      specifications: "",
      primaryDimension: "",
      quantity: "",
      customQuantity: "",
      uom: "",
      notes: "",
      cutLength: '',
      cutWidth: '',
    },
  });
  const alloyFamily = watch("alloyFamily");
  const productForm = watch("productForm");
  const gradeSelect = watch("grade");
  const cutLength = watch("cutLength");
  const formProd = products?.length
    ? products
      .flatMap(group => group.products || [])
      .find(prod => prod?._id === productForm)
      ?.product
      ?.toLowerCase() || ''
    : '';

  const isTubeOrPipe = formProd.endsWith('tube') || formProd.endsWith('pipe');
  const tolItemWidth = isTubeOrPipe ? null : toleranceData?.tolerance?.find(item => (item?.label === 'Width or Wall')) || ''
  const cutWidth = tolItemWidth ? watch("cutWidth") : '';
  const specificationsSelected = watch("specifications");
  const totalQuantity = activeTab === 'stock' ? watch("quantity") : watch('customQuantity');
  const selectedPrimaryDimension = watch("primaryDimension");
  function calculateCuttionPortionValue({ I15, G15, K15, M15, N15, C15, D15 }) {
    return I15 * (G15 + (K15 === 0 ? 0 : ((M15 + N15) * (C15 + D15))));
  }
  function calculateKrefLossWidthValue({ G15, M15, N15, C15, D15, S15, R15, W15 }) {
    return (G15 + ((M15 + N15) * (C15 + D15))) * N15 * S15 * R15 * (1 - W15);
  }

  const reuquireURLData = [
    {
      name: "alloyFamily",
      nameKey: "alloyFamily",
      nameValue: "",
      nameSelect: "products.product products._id type",
    },
    {
      name: "productForm",
      nameKey: "products._id",
      nameValue: "",
      nameSelect: "products.grades products.product  products._id type",
    },
  ];
  const productFormOption = products?.length ? products : [];
  const selectedProduct = grades?.[0]?.products?.find(
    (item) => item?._id === productForm
  );
  const selectedGrade = selectedProduct?.grades?.find(
    (item) => item?._id === gradeSelect
  );
  const selectedSpecification = selectedGrade?.specifications?.find(
    (item) => item?._id === specificationsSelected
  );
  const gradeAlloyOption = selectedProduct?.grades || [];
  const specificationOption = selectedGrade?.specifications || [];
  const primaryDimensionOption = selectedSpecification?.primaryDimension?.length > 0 ? sortCustomValues(selectedSpecification?.primaryDimension) : [] || [];
  const handleGetAlloyFamily = async () => {
    if (alloyFamilies?.length > 0) {
      return;
    }
    setIsLoading(true);
    await get("product/alloy-family")
      .then((result) => {
        if (result.success) {
          dispatch(setMetalType(result.alloyFamilies));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };
  function getTolerance(value, ranges, unit) {
    const valueInInches = Number(value);

    const sorted = ranges
      .map(r => ({
        ...r,
        min: r.min,
        max: r.max,
      }))
      .sort((a, b) => a.max - b.max);

    for (const r of sorted) {
      if (valueInInches > r.min && valueInInches <= r.max) return r.tolerance;
    }

    // Optional fallback: value is above all ranges
    const last = sorted[sorted.length - 1];
    if (valueInInches > last.max) return last.tolerance;

    return null;
  }
  const filterAlloyData = (data, alloyTypeSearch) => {
    const matchesAlloyType = (item) =>
      item.alloyType?.some(type =>
        type.toLowerCase().includes(alloyTypeSearch.toLowerCase())
      );

    const primary = data.filter(item => matchesAlloyType(item));
    const fallback = data.filter(item =>
      item.hexAF.length > 0 || item.thickness.length > 0 || item.diameter.length > 0 || item.width.length > 0 || item.wallTickness.length > 0 || item.insideDiameter.length > 0 || item.outsideDiameter.length > 0
    );

    const selected = primary.length > 0 ? primary : fallback;

    // Merge arrays of same keys across all selected items
    const mergedResult = selected.reduce((acc, item) => {
      acc.alloyFamily.add(item.alloyFamily);

      item.alloyType?.forEach(type => acc.alloyType.add(type));
      item.diameter?.forEach(val => acc.diameter.push(val));
      item.thickness?.forEach(val => acc.thickness.push(val));
      item.outsideDiameter?.forEach(val => acc.outsideDiameter.push(val));
      item.insideDiameter?.forEach(val => acc.insideDiameter.push(val));
      item.hexAF?.forEach(val => acc.hexAF.push(val));
      return acc;
    }, {
      alloyFamily: new Set(),
      alloyType: new Set(),
      diameter: [],
      thickness: [],
      outsideDiameter: [],
      insideDiameter: [],
      hexAF: [],
      length: [],
      width: []
    });
    // Convert Sets to arrays

    const result = {
      alloyFamily: [...mergedResult.alloyFamily],
      alloyType: [...mergedResult.alloyType],
      diameter: mergedResult.diameter,
      thickness: mergedResult.thickness,
      outsideDiameter: mergedResult.outsideDiameter,
      insideDiameter: mergedResult.insideDiameter,
      hexAF: mergedResult.hexAF,

    };
    const length1 = data.filter(item => item?.length?.length > 0) || [];
    const width1 = data.filter(item => item?.width?.length > 0) || [];

    const length = length1.flatMap(item => item?.length) || [];
    const width = width1.flatMap(item => item?.width) || [];

    // Only return result if there's at least some data
    const hasData = Object.values(result).some(arr => Array.isArray(arr) ? arr.length > 0 : false);
    return hasData ? { ...result, width, length } : null;
  };
  const hanldeGetR27MarginRange = async (value) => {
    if (!value) {
      return
    }
    try {
      const result = await get('r27-margin/by-range', { value })
      return result?.data || null
    } catch (error) {
      console.log(err)
    }
  }
  const getPriceForWeight = (inputWeight) => {
    const parsedWeight = parseFloat(inputWeight);

    if (isNaN(parsedWeight)) {
      return;
    }

    const matchedRange = priceRanges.find(
      (range) => parsedWeight >= range.min && parsedWeight <= range.max
    );
    return matchedRange;
  };
  const handleCustomCut = async ({ price = 0, isCustomCut = false, priceReturn = false }) => {
    if (!toleranceData || !price > 0 || !isCustomCut) {
      return
    }
    const alloyData = filterAlloyData(tolData, alloyFamily)

    // const metalFamily = getUnique(calData, 'alloyFamily')
    // const gradeData = selectedProduct?.product ? getUnique(calData?.filter(item => item.alloyFamily === selectedProduct?.product), 'alloyType') : []
    const densityData = calData?.find(item => (item.alloyFamily === alloyFamily && item.alloyType === selectedGrade?.gradeAlloy))  /// density from weigth calculator

    const diameterTol = alloyData?.diameter?.length > 0 ? getTolerance(cutLength, alloyData?.diameter || []) : null

    // const hexAFTol = alloyData?.hexAF?.length > 0 ? getTolerance(hexAFValue, alloyData?.hexAF || [],) : null
    // const thicknessTol = alloyData?.thickness?.length > 0 ? getTolerance(thicknessValue, alloyData?.thickness || []) : null
    // const insideDiameterTol = alloyData?.outsideDiameter?.length > 0 ? getTolerance(outsideDiameterValue, alloyData?.outsideDiameter || []) : null
    // const wallTicknessTol = alloyData?.wallTickness?.length > 0 ? getTolerance(wallTicknessValue, alloyData?.wallTickness || []) : null
    // const outsideDiameterTol = alloyData?.insideDiameter?.length > 0 ? getTolerance(insideDiameterValue, alloyData?.insideDiameter || [],) : null

    // Column B Primary Dimention
    const M3 = Number(toleranceData?.tolerance?.find(item => item?.label === "Diameter, Thickness, or OD")?.value || 0)
    // Column C Primary Tolerance
    // const N3 = lengthTol
    const N3 = Number(toleranceData?.tolerance?.find(item => item?.label === "Primary Dim 1 Tolerance")?.value || 0)
    console.log({ cutWidth })
    const lengthTol = alloyData?.length?.length > 0 ? getTolerance(M3, alloyData?.length || []) : null
    const widthTol = Number(cutWidth || 0) > 0 ? (alloyData?.width?.length > 0 ? getTolerance(M3, alloyData?.width || []) : null) : ''
    console.log({ toleranceData })
    console.log({ alloyData })
    console.log({ widthTol, lengthTol })
    const O3 = cutWidth ? Number(cutWidth) : Number(toleranceData?.tolerance?.find(item => item?.label === "Width or Wall")?.value || 0)
    // Column F
    const P3 = widthTol ? Number(widthTol) : Number(toleranceData?.tolerance?.find(item => item?.label === "Secondary Dim 2 Tolerance")?.value || 0)

    const cuttingSq = Number(toleranceData?.tolerance?.find(item => item?.label === "Cutting $/ Sq. In.")?.value || 0) // column E8

    const density = Number(toleranceData?.tolerance?.find(item => item?.label === "density")?.value || 0) // column L8

    const r27MarginIdentifier = (toleranceData?.tolerance?.find(item => item?.label === "Used for Margin Identifier Excess, TISH 64, TIRD 64, TIPL 64, MM, Other Ti")?.value || 0)

    console.log(Number(toleranceData?.tolerance?.find(item => item?.label === "Width or Wall")?.value || 0), 'ooooo3')
    const formulaValue = customCutFormula({ type: selectedProduct?.product, N3: N3, M3: M3, O3: O3, P3: P3 }) // column F8

    const surfaceTotal = cutWidth ? calculateCuttionPortionValue({
      I15: cuttingSq,
      G15: formulaValue,
      K15: Number(cutWidth),
      M15: Number(cutLength),
      N15: lengthTol,
      C15: M3,
      D15: P3,
    }) : (formulaValue * cuttingSq) // column F8
    console.log({
      I15: cuttingSq,
      G15: formulaValue,
      K15: Number(cutWidth),
      M15: Number(cutLength),
      N15: lengthTol,
      C15: M3,
      D15: P3,
    })
    console.log({ surfaceTotal })
    const kerfValue = lengthTol // column G8

    // const weightCalData = calculateWeightWithoutHTML({
    //   productForm: selectedProduct?.product, dimensions: {
    //     M3: Number(cutLength), N3: diameterTol,
    //     LT: lengthTol,
    //     L: 1,
    //     S3: density
    //   },
    //   quantity: totalQuantity,
    //   withTolerance: true
    // })
    console.log({ O3, P3 })
    const variableDef = formulaValue// cloumn c8

    const weightCalData = (variableDef * (Number(cutLength) + kerfValue) * density)

    const totalWeightData = weightCalData * totalQuantity
    if (priceReturn) {
      return { totalWeightLbs: totalWeightData }
    }
    const r27MarginData = await hanldeGetR27MarginRange(totalWeightData)
    const marginValue = r27MarginData ? r27MarginData?.marginCode?.find(item => (item?.label)?.toLowerCase() === (r27MarginIdentifier)?.toLowerCase())?.value : '' // column q8

    const krefLossTotalWithoutPrice = Number(density) * kerfValue * customCutFormula({ type: selectedProduct?.product, N3: N3, M3: M3 })
    // const krefLossTotal = price * krefLossTotalWithoutPrice // old value
    console.log({ marginValue })
    const krefLossTotal = cutWidth ?
      calculateKrefLossWidthValue({
        G15: formulaValue,
        M15: Number(cutLength),
        N15: lengthTol,
        C15: M3,
        D15: P3,
        R15: density,
        S15: price,
        W15: marginValue
      }) : variableDef * kerfValue * price * density * (1 - marginValue)
    const krefSubTotal = surfaceTotal + krefLossTotal

    const totalCuttingPortionPerPC = krefSubTotal / (1 - marginValue)
    const totalCuttingPortionPerOrder = totalCuttingPortionPerPC * totalQuantity
    const totalWeightLbs = Number(totalWeightData)
    const totalMetalPortionPerOrder = price * totalWeightLbs
    const totalSellingValueIN = totalMetalPortionPerOrder + totalCuttingPortionPerOrder
    const totalUnitSellingPricePerPC = totalSellingValueIN / totalQuantity

    console.table({ c8: variableDef, h8: Number(cutLength), g8: kerfValue, l8: density, m8: price, q8: marginValue, o8: krefSubTotal })

    console.table({
      variableDef,
      cuttingSq,
      surfaceTotal,
      kerfValue,
      pieceWeightLbs: weightCalData,
      totalWeightLbs: totalWeightData,
      krefLossTotal,
      krefSubTotal,
      r27MarginIdentifier,
      marginValue,
      totalCuttingPortionPerPC,
      totalCuttingPortionPerOrder,
      totalMetalPortionPerOrder,
      totalSellingValueIN,
      totalUnitSellingPricePerPC
    })
    return {
      variableDef,
      cuttingSq,
      surfaceTotal,
      kerfValue,
      density,
      krefLossTotalWithoutPrice,
      krefLossTotal,
      krefSubTotal,
      pieceWeightLbs: weightCalData,
      totalWeightLbs: totalWeightData,
      r27MarginIdentifier,
      marginValue,
      totalCuttingPortionPerPC,
      tolItemWidth,
      totalCuttingPortionPerOrder,
      totalMetalPortionPerOrder,
      totalSellingValueIN,
      totalUnitSellingPricePerPC, lengthTol,
      widthTol: P3,
      M3
    }
  }
  const handleCustomCutCalulation = async ({ price = 0, isCustomCut = false, item = null, cartData = null, totalQuantity, priceReturn = false }) => {
    if (!price > 0 || !isCustomCut || !item) {
      return
    }
    const krefLossTotal = cartData?.cutWidth ?
      calculateKrefLossWidthValue({
        G15: item?.variableDef,
        M15: Number(cartData?.cutLength),
        N15: item?.lengthTol,
        C15: item?.M3,
        D15: item?.widthTol,
        R15: item?.density,
        S15: price,
        W15: item?.marginValue
      }) : item?.variableDef * item?.kerfValue * price * item?.density * (1 - item?.marginValue)
    const krefSubTotal = item?.surfaceTotal + krefLossTotal

    const totalCuttingPortionPerPC = krefSubTotal / (1 - item?.marginValue)
    const totalCuttingPortionPerOrder = totalCuttingPortionPerPC * totalQuantity
    const totalWeightLbs = item?.pieceWeightLbs * totalQuantity
    if (priceReturn) {
      return { totalWeightLbs: totalWeightLbs }
    }
    const totalMetalPortionPerOrder = price * totalWeightLbs
    const totalSellingValueIN = totalMetalPortionPerOrder + totalCuttingPortionPerOrder
    const totalUnitSellingPricePerPC = totalSellingValueIN / totalQuantity


    console.table({
      ...item,
      krefLossTotal,
      krefSubTotal,
      totalMetalPortionPerOrder,
      totalSellingValueIN,
      totalUnitSellingPricePerPC
    })
    return {
      ...item,
      krefLossTotal,
      krefSubTotal,
      totalMetalPortionPerOrder,
      totalSellingValueIN,
      totalUnitSellingPricePerPC
    }
  }
  const fetchTolerance = useCallback(async () => {
    if (!selectedProduct?.product) {
      return
    }
    let queryData = {
      alloyFamily: { $in: [selectedProduct?.product] }
    }
    await get('tol-weigth/tol/specific', { queryItem: queryData })
      .then((result) => {
        if (result?.success) {
          const nData = result?.data?.length > 0 ? result?.data?.map((item) => ({ ...item, [item?.type]: item?.[item?.type]?.map(innerItem => ({ ...innerItem, unit: item.unit })) })) : []
          setTolData(nData)
        }
      }).catch((err) => {
        console.log(err)
      });
  }, [selectedProduct?.product])
  const handleGetCart = async () => {
    setIsCartLoading(true);
    await get("cart/all")
      .then((result) => {
        if (result.success) {
          dispatch(setTableData(result.carts));
          const quantityObj = {}; // Create an object to store indexed quantities
          result.carts.forEach((item, index) => {
            quantityObj[index] = item.quantity; // Set quantity using index as key
          });
          setQuantityData(quantityObj); // Update state
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsCartLoading(false));
  };
  const handleGetByName = async (urlData, setData) => {
    setIsLoading(true);
    const urlsData = {
      nameKey: urlData?.nameKey,
      nameValue: urlData?.nameValue,
      nameSelect: urlData?.nameSelect,
    };
    await get("product/byName", urlsData)
      .then((result) => {
        if (result.success) {
          setData(result.product);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };
  const handleGetTol = async (id) => {
    await get("tolerance/admin", { id })
      .then((result) => {
        if (result.success) {
          setToleranceData(result.tolerance);
        } else setToleranceData(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchMetalFamily = async () => {
    await get('density/specific')
      .then((result) => {
        if (result?.success) {
          setCalData(result?.data?.filter(item => (item?.updatedLabel !== 'Remove' && newMetalFamily.some(innerItem => (item?.alloyFamily)?.toLowerCase() === innerItem?.toLowerCase()))))
        }
      }).catch((err) => {
        console.log(err)
      });
  }
  useEffect(() => {
    handleGetCart();
    handleGetAlloyFamily();
    fetchMetalFamily()
  }, []);
  useEffect(() => {
    fetchTolerance()
  }, [selectedProduct]);
  const calculateTotalPrice = (data, discount = "0") => {
    const totalPrice =
      data?.reduce((total, item) => {
        const subtotal =
          Number(item?.prices?.price || 0) * Number(item?.quantity || 0);
        return total + subtotal;
      }, 0) || 0;

    // Convert discount string to a number (handles cases like "+10", "-10", "0")
    const discountValue = parseFloat(discount) || 0;

    // Adjust the total price based on the discount percentage
    const adjustedPrice = totalPrice + totalPrice * (discountValue / 100);

    return adjustedPrice.toFixed(2);
  };
  const handleRemove = async (i, item) => {
    dispatch(removeTableData(i));
    await deleteData(`cart/${item?._id}`)
      .then((result) => { })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        handleGetCart()
      })
  };
  const handleOnChange = async (i, totalQuantity) => {
    const quantity = Math.max(1, Number(totalQuantity));
    setQuantityData((prev) => ({ ...prev, [i]: quantity }));
  };
  const handleOnBlurQuantity = async (i, item, quantity) => {

    setIsLoading(true);
    const isCustomCut = Number(item?.cutLength) > 0
    const qtyPrice = isCustomCut ? await handleCustomCutCalulation({ price: 1, isCustomCut: isCustomCut, item: item?.customCut || null, cartData: item, totalQuantity: Number(quantity), priceReturn: true }) : quantity
    const { min, max } = getPriceForWeight(qtyPrice?.totalWeightLbs ? Number(qtyPrice?.totalWeightLbs) : Number(qtyPrice));
    let priceLabel = "";
    if (item?.type === "pipe-fitting") {
      priceLabel = quantity;
    } else {
      const uomData = UomOptions?.find(
        (itemInner) => itemInner.value === item?.uom
      )?.label;
      priceLabel = uomData === "lb"
        ? `$/${uomData}. Sales Price for ${min}  to ${max} lbs.`
        : `$/ ${uomData} Sales Price for ${min}  to ${max} lbs.`;
    }
    try {
      const result = await get("prices/admin", {
        id: item?.uniqueID,
        priceLabel: priceLabel,
      });
      if (result.success) {
        let priceData = {
          ...result?.prices?.prices,
          price: increasePrice(
            result?.prices?.prices?.price,
            userData?.isCompetitor,
            competMarkup
          ),
        };

        const customCut = await handleCustomCutCalulation({ price: Number(priceData?.price || 0), isCustomCut: isCustomCut, item: item?.customCut || null, cartData: item, totalQuantity: Number(quantity) })
        if (isCustomCut) {
          priceData.price = customCut?.totalUnitSellingPricePerPC || 0
        }
        await put(`/cart/edit/${item?._id}`, {
          ...item,
          prices: priceData,
          quantity,
          customCut: customCut || null
        })
          .then((response) => {
            if (response.success) {
              const tableIndex = tableData.findIndex(
                (value) => (value.uniqueID === item?.uniqueID && (isCustomCut ? !!value?.customCut : !value?.customCut))
              );
              dispatch(updateTableData(response.cart));
              setQuantityData((prev) => ({
                ...prev,
                [tableIndex]: response.cart?.quantity,
              }));
            }
          })
          .catch((err) => { });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      handleGetCart()
    }
  };

  const onSubmit = async (data) => {
    const isCustomCut = activeTab === 'custom'
    const nData = {
      ...data,
      alloyFamily: data?.alloyFamily,
      productForm: selectedProduct?.product,
      grade: selectedGrade?.gradeAlloy,
      type: grades?.[0]?.type,
      cutLength: activeTab === 'stock' ? "" : data?.cutLength,
      cutWidth: activeTab === 'stock' ? "" : data?.cutWidth || tolItemWidth,
      uom: isCustomCut ? "lb" : data?.uom,
      quantity: activeTab === 'stock' ? data?.quantity : data?.customQuantity,
      specifications: selectedSpecification?.specification,
      length: toleranceData
        ? Number(
          toleranceData.tolerance.find((item) => item?.label === "Length")
            ?.value
        )?.toFixed(2) + `"`
        : "",
      lengthTolerance: toleranceData
        ? Number(
          toleranceData.tolerance.find(
            (item) => (item?.label === "Length Tolerance" || item?.label === 'Length\nTolerance' || item?.label === 'Length\r\nTolerance')
          )?.value
        ).toFixed(2) + `"`
        : "",
      primaryDimTol: toleranceData
        ? toleranceData?.tolerance?.find(
          (item) => item.label === "Primary Dim 1 Tolerance"
        )?.value + `"`
        : "",
    };
    const uniqueID = generateNewUniqueID(nData);
    // if (activeTab === 'stock') {
    let priceLabel = "";
    const uomData = UomOptions?.find((item) => item.value === nData?.uom)?.label;
    if (nData?.type === "pipe-fitting") {
      priceLabel = nData?.quantity;
    } else {
      const qtyPrice = isCustomCut ? await handleCustomCut({ price: Number(1), isCustomCut: isCustomCut, priceReturn: true }) : Number(nData?.quantity)
      const { min, max } = getPriceForWeight(qtyPrice?.totalWeightLbs ? Number(qtyPrice?.totalWeightLbs) : Number(qtyPrice));
      priceLabel =
        uomData === "lb"
          ? `$/${uomData}. Sales Price for ${min}  to ${max} lbs.`
          : `$/ ${uomData} Sales Price for ${min}  to ${max} lbs.`;
    }
    setIsLoading(true);
    await get("prices/admin", { id: uniqueID, priceLabel: priceLabel })
      .then(async (result) => {
        if (result.success && result?.prices?.prices?.price) {
          if (result?.prices?.prices?.price === "Call for Price") {
            alert(
              "Your selection exceeds maximum quantities available through our website. Please contact us today: email us at sales@titanium.com or call +1 973.983.1185"
            );
          } else {
            let priceData = {
              ...result?.prices?.prices,
              price: increasePrice(
                result?.prices?.prices?.price,
                userData?.isCompetitor,
                competMarkup
              ),
            };
            const tableIndex = tableData.findIndex(
              (value) => (value.uniqueID === uniqueID && (isCustomCut ? !!value?.customCut : !value?.customCut))
            );
            const customCut = await handleCustomCut({ price: Number(priceData?.price || 0), isCustomCut: isCustomCut })
            if (isCustomCut) {
              priceData.price = customCut?.totalUnitSellingPricePerPC || 0
              if (!customCut?.marginValue || !customCut?.density) {
                alert(
                  "Your selection exceeds maximum quantities available through our website. Please contact us today: email us at sales@titanium.com or call +1 973.983.1185"
                );
                return
              }
            }
            if (tableIndex !== -1) {
              await put(`/cart/edit/${tableData[tableIndex]?._id}`, {
                ...nData,
                pricesId: result?.prices?._id,
                prices: priceData,
                uniqueID,
                customCut: customCut || null
              })
                .then((result) => {
                  if (result.success) {
                    dispatch(updateTableData(result.cart));
                    setQuantityData((prev) => ({
                      ...prev,
                      [tableIndex]: nData?.quantity,
                    }));
                    // reset();
                    // setActiveTab('stock')
                    // setToleranceData(null);
                  }
                })
                .catch((err) => { });
            } else {
              await post("/cart/create", {
                ...nData,
                pricesId: result?.prices?._id,
                prices: priceData,
                uniqueID,
                customCut: customCut || null
              })
                .then((result) => {
                  if (result.success) {
                    dispatch(updateTableData(result.cart));
                    // reset();
                    // setActiveTab('stock')
                    // setToleranceData(null);
                    const indexNo = tableData?.length || 0;
                    setQuantityData((prev) => ({
                      ...prev,
                      [indexNo]: result.cart?.quantity,
                    }));
                  }
                })
                .catch((err) => { });
            }
          }
        } else {
          alert(
            "Your selection exceeds maximum quantities available through our website. Please contact us today: email us at sales@titanium.com or call +1 973.983.1185"
          );
          // reset();
          // setToleranceData(null);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false)
        handleGetCart()
      });
    // } else {
    //   const tableIndex = tableData.findIndex(
    //     (value) => value.uniqueID === uniqueID
    //   );
    //   if (tableIndex !== -1) {
    //     await put(`/cart/edit/${tableData[tableIndex]?._id}`, {
    //       ...nData,
    //       pricesId: null,
    //       prices: {
    //         price: 0
    //       },
    //       uniqueID,
    //     })
    //       .then((result) => {
    //         if (result.success) {
    //           dispatch(updateTableData(result.cart));
    //           setQuantityData((prev) => ({
    //             ...prev,
    //             [tableIndex]: data?.quantity,
    //           }));
    //           reset();
    //           setToleranceData(null)
    //           setToleranceData(null);
    //         }
    //       })
    //       .catch((err) => { });
    //   } else {
    //     await post("/cart/create", {
    //       ...nData,
    //       pricesId: null,
    //       prices: {
    //         price: 0
    //       },
    //       uniqueID,
    //     })
    //       .then((result) => {
    //         if (result.success) {
    //           dispatch(updateTableData(result.cart));
    //           reset();
    //           setActiveTab('stock')
    //           setToleranceData(null);
    //           const indexNo = tableData?.length || 0;
    //           setQuantityData((prev) => ({
    //             ...prev,
    //             [indexNo]: result.cart?.quantity,
    //           }));
    //         }
    //       })
    //       .catch((err) => { });
    //   }
    // }
  };
  function calculateTax(amount, taxPercent) {
    const taxAmount = (amount * taxPercent) / 100;
    return taxAmount;
  }
  const handleCreateQuote = async () => {
    try {
      const totalAmount = calculateTotalPrice(tableData, userData?.discount || "0")
      const taxAmount = calculateTax(totalAmount, 0)
      setIsLoading(true)
      const response = await post('quotation/finalize-btn/create', { quote: tableData, notes, totalAmount: (taxAmount + totalAmount), subtotal: totalAmount, tax: taxAmount, })
      if (response?.success) {
        const blob = await pdf(<QuotationPDFTemplate quotationData={response?.quotation} />).toBlob();

        const formData = new FormData();
        formData.append('pdf', blob, 'quotation.pdf');

        await put(`quotation/finalize-btn/${response?.quotation?._id}`, formData, { headers: header2 })
        toast.success(response?.message)
      }
    } catch (error) {
      console.log(error)
      handleError(error)
    } finally {
      setIsLoading(false);
      push('/customer/cart', { state: notes })
    }
  };
  const onSubmitQuote = async (e) => {
    e.preventDefault();
    await handleCreateQuote()
    // setIsLoading(true);
    // await post("quotation/create", {
    //   quote: tableData,
    //   type: "cart",
    //   notes,
    //   totalAmount: calculateTotalPrice(tableData),
    // })
    //   .then((result) => {
    //     if (result.success) {
    //       setNotes("");
    //       dispatch(setTableData([]));
    //       toast.success(result.message);
    //     }
    //   })
    //   .catch((err) => {
    //     handleError(err);
    //   })
    //   .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    const nData = {
      alloyFamily: alloyFamily,
      productForm: selectedProduct?.product,
      grade: selectedGrade?.gradeAlloy,
      type: grades?.[0]?.type,
      specifications: selectedSpecification?.specification,
      primaryDimension: selectedPrimaryDimension,
    };

    if (
      nData.alloyFamily &&
      nData.grade &&
      nData.productForm &&
      nData.type &&
      nData.specifications &&
      nData.specifications &&
      nData.type === "mill-product"
    ) {
      const uniqueID = generateNewUniqueID(nData);
      handleGetTol(uniqueID);
    }
  }, [selectedPrimaryDimension]); // Add dependencies

  function renderLengthWithTolerance(toleranceData) {
    const lengthItem = toleranceData.tolerance.find(item => item?.label === 'Length');
    const lengthTolItem = toleranceData.tolerance.find(item => (item?.label === 'Length\nTolerance' || item?.label === 'Length\r\nTolerance'));

    const length = lengthItem?.value;
    const lengthTol = lengthTolItem?.value;

    if (length == null) return null;

    return (<div className="flex gap-3">
      <h6>Length: </h6>
      <span>{length}" {lengthTol !== null && !isNaN(lengthTol) ? <span className="text-sm"> ± {Number(lengthTol)?.toFixed(4)}"</span> : ''}</span>
    </div>
    );
  }

  function renderWidthWithTolerance(toleranceData) {
    const widthItem = toleranceData.tolerance.find(item => item?.label === 'Width or Wall');
    const secondaryDimItem = toleranceData.tolerance.find(item => item?.label === "Secondary Dim 2 Tolerance");

    const width = widthItem?.value;
    const secondaryDim = secondaryDimItem?.value;

    if (width == null) return null;

    return <div className="flex gap-3">
      <h6>Width: </h6><span>{width}"</span> {secondaryDim !== null && !isNaN(secondaryDim) ? <span className="text-sm"> ± {Number(secondaryDim)?.toFixed(4)}"</span> : ''} </div>;
  }

  return (
    <>
      {(isLoading || isCartLoading) && <SpinnerOverlay />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Step 1: Material Selection
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            Please select Metal Type, Product Form, Grade/Alloy, and
            Specifications.
            <br />
            Once completed, please proceed to Product Configuration.
          </p>

          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-lg:text-start  gap-4 bg-gray-200 p-2 md:p-4 rounded-lg">
            <div>
              <Label>METAL TYPE</Label>
              <Controller
                name="alloyFamily"
                control={control}
                disabled={""}
                render={({ field }) => (
                  <Select
                    {...field}
                    aria-invalid={!!errors.alloyFamily}
                    value={field.value}
                    onChange={(e) => {
                      setValue("alloyFamily", e.target.value);
                      clearErrors("alloyFamily");
                      setValue("grade", "");
                      setValue("productForm", "");
                      setValue("specifications", "");
                      setActiveTab('stock')
                      setValue("primaryDimension", "");
                      // setValue("uom", "");
                      // setValue("quantity", "");
                      setToleranceData(null)
                      handleGetByName(
                        {
                          ...reuquireURLData.find(
                            (item) => item.name === "alloyFamily"
                          ),
                          nameValue: e.target.value,
                        },
                        setProducts
                      );
                    }}
                  >
                    <SelectOption disabled value="">
                      Select...
                    </SelectOption>
                    {alloyFamilies?.map((item, index) => (
                      <SelectOption key={index} value={item}>
                        {item}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
              {errors.alloyFamily && (
                <FormFeedback>{errors.alloyFamily.message}</FormFeedback>
              )}
            </div>

            <div>
              <Label>PRODUCT FORM</Label>
              <Controller
                name="productForm"
                control={control}
                disabled={""}
                render={({ field }) => (
                  <Select
                    {...field}
                    aria-invalid={!!errors.productForm}
                    value={field.value}
                    onChange={(e) => {
                      setValue("productForm", e.target.value);
                      clearErrors("productForm");
                      setValue("grade", "");
                      setValue("specifications", "");
                      setActiveTab('stock')
                      setValue("primaryDimension", "");
                      // setValue("uom", "");
                      setToleranceData(null)
                      // setValue("quantity", "");
                      handleGetByName(
                        {
                          ...reuquireURLData.find(
                            (item) => item.name === "productForm"
                          ),
                          nameValue: e.target.value,
                        },
                        setGrades
                      );
                    }}
                  >
                    <SelectOption disabled value="">
                      Select...
                    </SelectOption>
                    {productFormOption?.map((item, index) => (
                      <optgroup
                        key={index}
                        label={
                          item?.type === "mill-product"
                            ? "Mill Product"
                            : item?.type === "pipe-fitting"
                              ? "Pipe & Fittings"
                              : "Margin Guidelines"
                        }
                      >
                        {item?.products?.map((innerItem, innerIndex) => (
                          <SelectOption key={innerIndex} value={innerItem?._id}>
                            {innerItem?.product}
                          </SelectOption>
                        ))}
                      </optgroup>
                    ))}
                  </Select>
                )}
              />
              {errors.productForm && (
                <FormFeedback>{errors.productForm.message}</FormFeedback>
              )}
            </div>

            <div>
              <Label>GRADE/ALLOY</Label>
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
                      setActiveTab('stock')
                      setValue("primaryDimension", "");
                      // setValue("uom", "");
                      // setValue("quantity", "");
                      setToleranceData(null)
                    }}
                  >
                    <SelectOption disabled value="">
                      Select...
                    </SelectOption>
                    {gradeAlloyOption?.map((item, index) => (
                      <SelectOption key={index} value={item?._id}>
                        {item?.gradeAlloy}
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
              <Label>SPECIFICATIONS</Label>
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
                      setActiveTab('stock')
                      // setValue("uom", "");
                      // setValue("quantity", "");
                      setToleranceData(null)
                    }}
                    {...field}
                  >
                    <SelectOption disabled value="">
                      Select...
                    </SelectOption>
                    {specificationOption?.map((item, index) => (
                      <SelectOption key={index} value={item?._id}>
                        {item?.specification}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
              {errors.specifications && (
                <FormFeedback>{errors.specifications.message}</FormFeedback>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Product Configuration */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Step 2: Product Configuration
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Material Selection must be completed to access Product
            Configuration.
          </p>
          <p className="text-gray-600 text-sm mb-8">
            Not seeing the product you're looking for? Use our{" "}
            <a
              href="https://titanium.com/rfq"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFQ submittal form
            </a>
            .
          </p>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4  max-lg:text-start bg-gray-200 p-2 md:p-4 rounded-lg">
            <div>
              <Label>PRIMARY DIMENSION</Label>
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
                      // setValue("uom", "");
                      // setValue("quantity", "");
                    }}
                    {...field}
                  >
                    <SelectOption disabled value="">
                      Select...
                    </SelectOption>
                    {primaryDimensionOption?.map((item, index) => (
                      <SelectOption key={index} value={item}>
                        {item}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
              {errors.primaryDimension && (
                <FormFeedback>{errors.primaryDimension.message}</FormFeedback>
              )}
            </div>

            <div>
              <Label>QUANTITY</Label>
              <Controller
                name="quantity"
                disabled={0 || activeTab !== 'stock'}
                control={control}
                rules={{ required: activeTab === 'stock' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // setValue("uom", "");
                      setValue('customQuantity', e.target.value)
                    }}
                    aria-invalid={!!errors.quantity}
                    type="number"
                  />
                )}
              />
              {errors.quantity && (
                <FormFeedback>{errors.quantity.message}</FormFeedback>
              )}
            </div>

            <div>
              <Label>Quantity Unit of Measure (UOM)</Label>
              <Controller
                name="uom"
                control={control}
                disabled={grades?.[0]?.type === "pipe-fitting" || activeTab !== 'stock'}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    aria-invalid={!!errors.uom}
                  >
                    <SelectOption disabled value="">
                      Select...
                    </SelectOption>
                    {UomOptions?.map((item, index) => (
                      <SelectOption key={index} value={item.value}>
                        {item.newLabel}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />
              {errors.uom && <FormFeedback>{errors.uom.message}</FormFeedback>}
            </div>
          </div>
          <div>
            {toleranceData?.tolerance && (
              <div className="pt-3">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Stock Size Button */}
                  <Button
                    type="button"
                    size="sm"
                    className="whitespace-nowrap"
                    variant={activeTab === 'stock' ? 'primary' : 'outline'}
                    onClick={() => {
                      setActiveTab('stock');
                      setValue('cutLength', '');
                      setValue('cutWidth', '');
                    }}
                  >
                    Stock Size
                  </Button>

                  {/* "or" Text */}
                  <span className="text-sm text-muted-foreground font-medium">or</span>

                  {/* Custom Cut-to-Size Button */}
                  <Button
                    type="button"
                    size="sm"
                    className={`whitespace-nowrap border-2 ${activeTab === 'custom' ? 'border-primary text-primary' : 'border-dashed border-gray-400'
                      }`}
                    variant="ghost"
                    onClick={() => {
                      setActiveTab('custom');
                      setValue('cutLength', '');
                      setValue('cutWidth', '');
                    }}
                  >
                    Custom Cut-to-Size
                  </Button>

                  {/* Service Text */}
                  <span className="text-sm text-muted-foreground">
                    T.I.'s Value Added Cutting Service
                  </span>
                </div>


                <div className="flex flex-wrap md:gap-6 gap-3">
                  <div className={`tab-content  ${activeTab === 'custom' && 'md:mt-5'}`}>
                    <div className="text-start flex flex-col gap-1 mb-3">
                      {renderLengthWithTolerance(toleranceData)}
                      {renderWidthWithTolerance(toleranceData)}
                    </div>
                  </div>
                  {activeTab === 'custom' && (
                    <div className="tab-content md:flex-1 text-start flex flex-wrap gap-3">
                      <div className=" sm:flex-1 w-full sm:max-w-72">
                        <Label className="pb-2">Cut Length (Inches) </Label>
                        <Controller
                          name="cutLength"
                          disabled={0}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              placeholder="Enter Cut Length (Inches)"
                              aria-invalid={!!errors.cutLength}
                              type="number"
                            />
                          )}
                        />
                        {errors.cutLength && (
                          <FormFeedback>{errors.cutLength.message}</FormFeedback>
                        )}
                      </div>
                      {tolItemWidth && <div className=" sm:flex-1 w-full sm:max-w-72">
                        <Label className="pb-2">Cut Width (Inches) </Label>
                        <Controller
                          name="cutWidth"
                          disabled={0}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (e.target.value > Number(tolItemWidth?.value)) {
                                  setError('cutWidth', { message: `Invalid value: must be less than or equal to ${tolItemWidth?.value}` })
                                } else {
                                  clearErrors('cutWidth')
                                }
                              }}
                              placeholder="Enter Cut Width (Inches)"
                              max={Number(tolItemWidth?.value)}
                              aria-invalid={!!errors.cutWidth}
                              type="number"
                            />
                          )}
                        />
                        {errors.cutWidth && (
                          <FormFeedback>{errors.cutWidth.message}</FormFeedback>
                        )}
                      </div>}
                      <div className=" sm:flex-1 w-full sm:max-w-72">
                        <Label className="pb-2">QUANTITY</Label>
                        <Controller
                          name="customQuantity"
                          disabled={0}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setValue('quantity', e.target.value)
                              }}
                              placeholder="Enter Qauntity"
                              aria-invalid={!!errors.customQuantity}
                              type="number"
                            />
                          )}
                        />
                        {errors.customQuantity && (
                          <FormFeedback>{errors.customQuantity.message}</FormFeedback>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>)}
          </div>
          {totalQuantity && (
            <div className="mt-3 ">
              <Button type="submit">+ Add to Quote</Button>{" "}
              <Button
                type="reset"
                variant="secondary"
                onClick={() => {
                  reset();
                  setToleranceData(null)
                  setActiveTab('stock')
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </form>
      {/* Step 3: Finalize Quote */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold mb-4">Step 3: Finalize Quote</h2>
        <p className="text-sm text-gray-600 mb-8 max-w-4xl mx-auto">
          Prices at time of order acknowledgement apply and are subject to
          change. Titanium Industries reserves the right to make any corrections
          to prices quoted due to new information, errors, or any other
          significant changes. All orders are subject to a full contract review
          of all specifications and a 48-hour order approval process to verify
          all details, stock availability, and terms and conditions. All orders
          will be acknowledged by a T.I. salesperson.
        </p>

        {tableData?.length > 0 && (
          <div className="pb-2  bg-gradient-to-r from-gray-100 to-gray-200 p-3 md:p-6 rounded-lg">
            <Table >
              {tableData?.find(item => !!item.cutLength) && <TableHeader className="pb-0 ">
                <TableCell colSpan={6}>
                  <FormFeedback className="p-0 m-0">Cutting costs are included in the below quote.  All pricing quoted subject to T.I. salesperson validation during order confirmation and contract review.</FormFeedback>
                </TableCell>
              </TableHeader>}
              <TableHeader>
                <TableHead>Product Description</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Sub Total</TableHead>
              </TableHeader>
              <TableBody>
                {tableData?.map((item, index) => (
                  <Fragment key={index}>
                    <TableRow className={item?.cutLength ? "border-0" : ''}>
                      <TableCell>
                        {item?.alloyFamily}, {item?.productForm},{" "}
                        {item?.primaryDimension}{" "}
                        {item?.primaryDimTol ? `±${item?.primaryDimTol}` : ""},{" "}
                        {item?.cutLength ? <div>
                          Custom Cut Length: {item?.cutLength}"
                        </div> : ""}{" "}
                        {item?.cutWidth ? <div>
                          Custom Cut Width: {item?.cutWidth}"
                        </div> : ""}
                        {/* <br />{" "} */}
                        {item?.identifier === "Excess" ? (
                          <div className="text-danger">
                            Clearance <br />{" "}
                            <Link
                              href={"/customer/discounted-products"}
                              className="text-danger underline"
                            >
                              View more Clearance items here
                            </Link>{" "}
                          </div>
                        ) : (
                          ""
                        )}{" "}

                      </TableCell>
                      <TableCell>{item?.grade} </TableCell>
                      <TableCell>{item?.specifications} </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="1"
                            className="max-w-28 min-w-11"
                            onChange={(e) => handleOnChange(index, e.target.value)}
                            onBlur={(e) =>
                              handleOnBlurQuantity(index, item, e.target.value)
                            }
                            value={quantityData?.[index]}
                          />{" "}
                          PCS
                          {/* {item?.uom === 'lb' ? 'lb.' : item?.uom === 'ft' ? 'ft.' : item?.uom === 'inch' && 'in.'}{" "} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        ${Number(item?.prices?.price).toFixed(2)}{" "}
                      </TableCell>
                      <TableCell>
                        $
                        {(
                          Number(item?.prices?.price) * Number(item?.quantity)
                        ).toFixed(2)}{" "}
                      </TableCell>
                      <TableCell className="p-0">
                        {" "}
                        <div className="flex">
                          <Button
                            onClick={() => handleRemove(index, item)}
                            variant="secondary"
                            className="px-2 py-1 h-auto"
                          >
                            <X size={20} />
                          </Button>
                        </div>{" "}
                      </TableCell>
                    </TableRow>
                    {(item?.cutLength && (tableData?.length - 1 !== index)) && <TableRow className="p-0 "> <TableCell colSpan={6} className="bg-white text-center py-[2px] rounded-md" ></TableCell> </TableRow>}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <form onSubmit={onSubmitQuote}>
          <div className="flex items-start flex-wrap justify-between mt-3 md:gap-8 max-md:gap-3 bg-gradient-to-r from-gray-100 to-gray-200 p-3 md:p-8 rounded-lg">
            <div className="flex-grow ">
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Please provide any additional remarks, requests, or pertinent information."
              />
            </div>
            <div className="flex flex-col items-end gap-4 ms-auto">
              <div className="text-xl font-semibold">
                Quote Total{" "}
                <span className="text-base font-normal">
                  {userData?.discount ? `(${userData?.discount}%)` : ""}
                </span>{" "}
                :{" "}
                <span className="text-blue-600">
                  ${calculateTotalPrice(tableData, userData?.discount || "0")}
                </span>
              </div>
              <button
                type="submit"
                disabled={!tableData?.length > 0 || isLoading}
                className="px-8 py-1.5 bg-[#0A1F3C] text-white text-base font-medium rounded-full hover:bg-[#1B365D] transition-colors"
              >
                {isLoading ? 'Finalize Quote...' : 'Finalize Quote'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
