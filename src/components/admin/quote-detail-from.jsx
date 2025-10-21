'use client'
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Select, SelectOption } from '../ui/select';
import ApiFunction from '@/lib/api/apiFuntions';
import { useEffect, useState } from 'react';
import SpinnerOverlay from '../ui/spinnerOverlay';
import { Input } from '../ui/input';
import { FormFeedback } from '../ui/formFeedBack';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ArrowLeft, Check, Cross, Pencil, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleError } from '@/lib/api/errorHandler';
import { useDispatch, useSelector } from 'react-redux';
import { setMetalType, setQuoteData, updateTableData } from '@/lib/redux/products';
import { generateNewUniqueID, increasePrice } from '@/lib/api/encrypted';
import { UomOptions } from '../tools/calculator/utils';
import Link from 'next/link';

export function QuoteDetailForm() {
  const { get, post, put, deleteData } = ApiFunction()
  const competMarkup = useSelector(state => state.prod.competMarkup)

  const dispatch = useDispatch()
  const quote = useSelector(state => state.prod.quoteData)
  const alloyFamilies = useSelector(state => state.prod.metalType)
  const [tableData, setTableData] = useState([]);
  const [products, setProducts] = useState([]);
  const [grades, setGrades] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');
  const [toleranceData, setToleranceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const quoteSchema = z.object({
    alloyFamily: z.string().min(1, 'Please select a metal type'),
    productForm: z.string().min(1, 'Please select a product form'),
    grade: z.string().min(1, 'Please select a grade'),
    specifications: z.string().min(1, 'Please select specifications'),
    primaryDimension: z.string().min(1, 'Please enter primary dimension'),
    quantity: activeTab !== 'stock' ? z.string().optional() : z.string().min(1, "Quantity must be at least 1"),
    customQuantity: activeTab === 'stock' ? z.string().optional() : z.string().min(1, "Quantity must be at least 1"),
    cutLength: activeTab === 'stock' ? z.string().optional() : z.string().min(1, "Custom cut must be at least 1"),
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
    formState: { errors }
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      alloyFamily: '',
      productForm: '',
      grade: '',
      specifications: '',
      primaryDimension: '',
      quantity: '',
      uom: '',
      notes: ''
    }
  });
  const alloyFamily = watch('alloyFamily')
  const productForm = watch('productForm')
  const gradeSelect = watch('grade')
  const specificationsSelected = watch('specifications')
  const totalQuantity = activeTab === 'stock' ? watch("quantity") : watch('customQuantity');
  const selectedPrimaryDimension = watch('primaryDimension')
  const reuquireURLData = [
    { name: 'alloyFamily', nameKey: 'alloyFamily', nameValue: '', nameSelect: 'products.product products._id type' },
    { name: 'productForm', nameKey: 'products._id', nameValue: '', nameSelect: 'products.grades products.product  products._id type' },
  ]
  const productFormOption = products?.length ? products : [];
  const selectedProduct = grades?.[0]?.products?.find(item => item?._id === productForm);
  const selectedGrade = selectedProduct?.grades?.find(item => item?._id === gradeSelect);
  const selectedSpecification = selectedGrade?.specifications?.find(item => item?._id === specificationsSelected);

  const gradeAlloyOption = selectedProduct?.grades || [];
  const specificationOption = selectedGrade?.specifications || [];
  const primaryDimensionOption = selectedSpecification?.primaryDimension || [];

  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState(null);

  const handleEditClick = (index) => {
    setEditIndex(index);
    const nData = { ...tableData[index] }
    setEditRow({ ...nData, oldPrices: nData?.oldPrices ? nData?.oldPrices : nData?.prices });
  };
  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditRow(null);
  };

  const handleGetAlloyFamily = async () => {
    if (alloyFamilies?.length > 0) {
      return
    }

    await get('product/alloy-family')
      .then((result) => {
        if (result.success) {
          dispatch(setMetalType(result.alloyFamilies))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }


  const handleGetByName = async (urlData, setData) => {
    setIsLoading(true)
    const urlsData = {
      nameKey: urlData?.nameKey, nameValue: urlData?.nameValue, nameSelect: urlData?.nameSelect
    }
    await get('product/byName', urlsData)
      .then((result) => {
        if (result.success) {
          setData(result.product)
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }
  const handleGetTol = async (id) => {
    await get('tolerance/admin', { id })
      .then((result) => {
        if (result.success) {
          setToleranceData(result.tolerance)
        } else setToleranceData(null)
      }).catch((err) => {
        console.log(err)
      });
  }

  useEffect(() => {
    handleGetAlloyFamily()
  }, []);
  useEffect(() => {
    if (quote) {
      setTableData(quote?.quote || [])
    }
  }, [quote]);
  function calculateTax(amount, taxPercent) {
    const taxAmount = (amount * taxPercent) / 100;
    return taxAmount;
  }
  const calculateTotalPrice = (data, discount = "0", frieght = 0) => {
    const totalPrice = data?.reduce((total, item) => {
      const subtotal = Number(item?.prices?.price || 0) * Number(item?.quantity || 0);
      return total + subtotal;
    }, 0) || 0;

    // Convert discount string to a number (handles cases like "+10", "-10", "0")
    const discountValue = parseFloat(discount) || 0;

    // Adjust the total price based on the discount percentage
    const adjustedPrice = totalPrice + (totalPrice * (discountValue / 100));

    return (adjustedPrice + Number(frieght));
  };
  const handleRemove = async (i) => {
    const delData = tableData.find((_, index) => index === i)
    const tData = tableData.filter((_, index) => index !== i)

    const totalAmount = calculateTotalPrice(tData, quote?.user?.discount || "0", quote?.frieght)
    const taxAmount = calculateTax(totalAmount, 0)

    setIsLoading(true)
    await put(`quotation/edit/${quote?._id}`, { quote: tData, delData, type: quote?.type, totalAmount: (taxAmount + totalAmount).toFixed(2), subtotal: totalAmount - quote?.frieght, tax: taxAmount, })
      .then((result) => {
        if (result.success) {
          setTableData(result?.data?.quote);
          dispatch(setQuoteData(result?.data))
          toast.success(result.message)
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => setIsLoading(false))
  }
  const totalAmount = calculateTotalPrice(tableData, quote?.user?.discount || "0", quote?.frieght)
  const taxAmount = calculateTax(totalAmount, 0)

  const priceRanges = [
    { min: 0, max: 1, },
    { min: 1.01, max: 2, },
    { min: 2.01, max: 3, },
    { min: 3.01, max: 4, },
    { min: 4.01, max: 5, },
    { min: 5.01, max: 10, },
    { min: 10.01, max: 20, },
    { min: 20.01, max: 30, },
    { min: 30.01, max: 40, },
    { min: 40.01, max: 50, },
    { min: 50.01, max: 75, },
    { min: 75.01, max: 100, },
    { min: 100.01, max: 125, },
    { min: 125.01, max: 150, },
    { min: 150.01, max: 200, },
    { min: 200.01, max: 300, },
    { min: 300.01, max: 400, },
    { min: 400.01, max: 500, },
    { min: 500.01, max: 600, },
    { min: 600.01, max: 700, },
    { min: 700.01, max: 800, },
    { min: 800.01, max: 900, },
    { min: 900.01, max: 1000, },
    { min: 1000.01, max: 2500, }
  ];
  const handleSaveEdit = async () => {
    const newData = [...tableData];
    newData[editIndex] = editRow;

    const totalAmount = calculateTotalPrice(newData, quote?.user?.discount || "0", quote?.frieght)
    const taxAmount = calculateTax(totalAmount, 0)

    await put(`quotation/edit/${quote?._id}`, { quote: newData, type: quote?.type, totalAmount: (taxAmount + totalAmount).toFixed(2), subtotal: totalAmount - quote?.frieght, tax: taxAmount })
      .then((result) => {
        if (result.success) {
          setEditIndex(null);
          setEditRow(null);
          setTableData(result?.data?.quote);
          dispatch(setQuoteData(result?.data))
          reset()
          setToleranceData(null)
          toast.success(result.message)
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => setIsLoading(false))
  };
  const getPriceForWeight = (inputWeight) => {
    const parsedWeight = parseFloat(inputWeight);

    if (isNaN(parsedWeight)) {
      return;
    }

    const matchedRange = priceRanges.find(
      range => parsedWeight >= range.min && parsedWeight <= range.max
    );
    return matchedRange
  };

  const onSubmit = async (data) => {
    const nData = {
      ...data,
      alloyFamily: data?.alloyFamily,
      productForm: selectedProduct?.product,
      grade: selectedGrade?.gradeAlloy,
      type: grades?.[0]?.type,
      specifications: selectedSpecification?.specification,
      cutLength: activeTab === 'stock' ? "" : data?.cutLength,
      quantity: activeTab === 'stock' ? data?.quantity : data?.customQuantity,
      uom: activeTab === 'stock' ? data?.uom : 'inch',
      length: toleranceData ? (Number(toleranceData.tolerance.find(item => item?.label === "Length")?.value))?.toFixed(2) + `"` : '',
      lengthTolerance: toleranceData ? (Number(toleranceData.tolerance.find(item => (item?.label === "Length\nTolerance" || item?.label === 'Length\r\nTolerance'))?.value)).toFixed(2) + `"` : '',
      primaryDimTol: toleranceData ? (toleranceData?.tolerance?.find((item) => item.label === 'Primary Dim 1 Tolerance')?.value) + `"` : ''
    }
    const uniqueID = generateNewUniqueID(nData)
    // if (activeTab === 'stock') {
    let priceLabel = ''
    const uomData = UomOptions?.find((item => item.value === nData?.uom))?.label
    if (nData?.type === 'pipe-fitting') {
      priceLabel = nData?.quantity
    } else {
      const { min, max } = getPriceForWeight(Number(nData?.quantity))
      priceLabel = uomData === 'lb' ? `$/${uomData}. Sales Price for ${min}  to ${max} lbs.` : `$/ ${uomData} Sales Price for ${min}  to ${max} lbs.`
    }
    setIsLoading(true)
    await get('prices/admin', { id: uniqueID, priceLabel: priceLabel })
      .then(async (result) => {
        if (result.success && result?.prices?.prices?.price) {
          if (result?.prices?.prices?.price === 'Call for Price') {
            alert('Your selection exceeds maximum quantities available through our website. Please contact us today: email us at sales@titanium.com or call +1 973.983.1185')
            // reset()
            // setToleranceData(null)
          } else {
            const priceData = {
              ...result?.prices?.prices,
              price: increasePrice(result?.prices?.prices?.price, quote?.user?.isCompetitor, competMarkup)
            };

            const tableIndex = tableData.findIndex((value) => value.uniqueID === uniqueID);

            const tData = [...tableData];

            if (tableIndex !== -1) {
              // Update existing entry
              tData[tableIndex] = { ...nData, pricesId: result?.prices?._id, prices: priceData, uniqueID };
            } else {
              // Add new entry
              tData.push({ ...nData, pricesId: result?.prices?._id, prices: priceData, uniqueID });
            }

            const totalAmount = calculateTotalPrice(tData, quote?.user?.discount || "0", quote?.frieght)
            const taxAmount = calculateTax(totalAmount, 0)

            setIsLoading(true)
            await put(`quotation/edit/${quote?._id}`, {
              quote: tData,
              type: quote?.type,
              totalAmount: (taxAmount + totalAmount).toFixed(2),
              subtotal: totalAmount - quote?.frieght,
              tax: taxAmount,
              cartItem: quote?.type === 'open-quote' ? { ...nData, pricesId: result?.prices?._id, prices: priceData, uniqueID } : null
            })
              .then((result) => {
                if (result.success) {
                  setTableData(result?.data?.quote);
                  dispatch(setQuoteData(result?.data))
                  reset()
                  setToleranceData(null)
                  setActiveTab('stock')
                  toast.success(result.message)
                }
              }).catch((err) => {
                handleError(err)
              }).finally(() => setIsLoading(false))
          }
        } else {
          alert('Your selection exceeds maximum quantities available through our website. Please contact us today: email us at sales@titanium.com or call +1 973.983.1185')
          // reset()
          // setToleranceData(null)
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
    // } else {
    //   setIsLoading(true)
    //   const tableIndex = tableData.findIndex((value) => value.uniqueID === uniqueID);

    //   const tData = [...tableData];

    //   if (tableIndex !== -1) {
    //     // Update existing entry
    //     tData[tableIndex] = {
    //       ...nData, pricesId: null,
    //       prices: {
    //         price: 0
    //       }, uniqueID
    //     };
    //   } else {
    //     // Add new entry
    //     tData.push({
    //       ...nData, pricesId: null,
    //       prices: {
    //         price: 0
    //       }, uniqueID
    //     });
    //   }
    //   const totalAmount = calculateTotalPrice(tData, quote?.user?.discount || "0", quote?.frieght)
    //   const taxAmount = calculateTax(totalAmount, 0)
    //   await put(`quotation/edit/${quote?._id}`, {
    //     quote: tData, type: quote?.type, totalAmount: (taxAmount + totalAmount).toFixed(2), subtotal: totalAmount- quote?.frieght, tax: taxAmount,
    //     cartItem: {
    //       ...nData, pricesId: null,
    //       prices: {
    //         price: 0
    //       },
    //       uniqueID
    //     }
    //   })
    //     .then((result) => {
    //       if (result.success) {
    //         setTableData(result?.data?.quote);
    //         dispatch(setQuoteData(result?.data))
    //         reset()
    //         setToleranceData(null)
    //         toast.success(result.message)
    //       }
    //     }).catch((err) => {
    //       handleError(err)
    //     }).finally(() => setIsLoading(false))

    // }
  };
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
  useEffect(() => {
    const nData = {
      alloyFamily: alloyFamily,
      productForm: selectedProduct?.product,
      grade: selectedGrade?.gradeAlloy,
      type: grades?.[0]?.type,
      specifications: selectedSpecification?.specification,
      primaryDimension: selectedPrimaryDimension
    };

    if (nData.alloyFamily && nData.grade && nData.productForm && nData.type && nData.specifications && nData.specifications && nData.type === 'mill-product') {
      const uniqueID = generateNewUniqueID(nData)
      handleGetTol(uniqueID)
    }
  }, [selectedPrimaryDimension]); // Add dependencies
  return (
    <>
      {(isLoading) && <SpinnerOverlay />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="">
          <h2 className="text-base font-semibold mb-3">Add Product</h2>

          <div className=" bg-gray-200 p-4 rounded-lg">
            <div className='grid  grid-cols-1 sm:grid-cols-2 max-lg:text-start  gap-4'>
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
                        setValue('alloyFamily', e.target.value);
                        clearErrors('alloyFamily')
                        setValue('grade', '')
                        setValue('productForm', '')
                        setValue('specifications', '')
                        setToleranceData(null)
                        setActiveTab('stock')
                        setValue('primaryDimension', '')
                        setValue('uom', '')
                        setValue('quantity', '')
                        handleGetByName(
                          {
                            ...reuquireURLData.find(item => item.name === 'alloyFamily'),
                            nameValue: e.target.value
                          },
                          setProducts
                        );
                      }}
                    >
                      <SelectOption disabled value="">Select...</SelectOption>
                      {alloyFamilies?.map((item, index) => (
                        <SelectOption key={index} value={item}>{item}</SelectOption>
                      ))}
                    </Select>
                  )}
                />
                {errors.alloyFamily && <FormFeedback>{errors.alloyFamily.message}</FormFeedback>}
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
                        setValue('productForm', e.target.value);
                        clearErrors('productForm')
                        setValue('grade', '')
                        setValue('specifications', '')
                        setToleranceData(null)
                        setActiveTab('stock')
                        setValue('primaryDimension', '')
                        setValue('uom', '')
                        setValue('quantity', '')
                        handleGetByName(
                          {
                            ...reuquireURLData.find(item => item.name === 'productForm'),
                            nameValue: e.target.value
                          },
                          setGrades
                        );
                      }}
                    >
                      <SelectOption disabled value="">Select...</SelectOption>
                      {productFormOption?.map((item, index) => (
                        <optgroup key={index} label={item?.type === "mill-product" ? "Mill Product" : item?.type === "pipe-fitting" ? 'Pipe & Fittings' : 'Margin Guidelines'}>
                          {item?.products?.map((innerItem, innerIndex) => (
                            <SelectOption key={innerIndex} value={innerItem?._id}>{innerItem?.product}</SelectOption>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                  )}
                />
                {errors.productForm && <FormFeedback>{errors.productForm.message}</FormFeedback>}
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
                        field.onChange(e)
                        setValue('specifications', '')
                        setToleranceData(null)
                        setActiveTab('stock')
                        setValue('primaryDimension', '')
                        setValue('uom', '')
                        setValue('quantity', '')
                      }} >
                      <SelectOption disabled value="">Select...</SelectOption>
                      {gradeAlloyOption?.map((item, index) => (
                        <SelectOption key={index} value={item?._id}>{item?.gradeAlloy}</SelectOption>
                      ))}
                    </Select>
                  )}
                />
                {errors.grade && <FormFeedback>{errors.grade.message}</FormFeedback>}
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
                        field.onChange(e)
                        setValue('primaryDimension', '')
                        setActiveTab('stock')
                        setValue('uom', '')
                        setValue('quantity', '')
                      }} {...field}>
                      <SelectOption disabled value="">Select...</SelectOption>
                      {specificationOption?.map((item, index) => (
                        <SelectOption key={index} value={item?._id}>{item?.specification}</SelectOption>
                      ))}
                    </Select>
                  )}
                />
                {errors.specifications && <FormFeedback>{errors.specifications.message}</FormFeedback>}
              </div>
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
                        field.onChange(e)
                        setValue('uom', '')
                        setValue('quantity', '')
                      }}
                      {...field}>
                      <SelectOption disabled value="">Select...</SelectOption>
                      {primaryDimensionOption?.map((item, index) => (
                        <SelectOption key={index} value={item}>{item}</SelectOption>
                      ))}
                    </Select>
                  )}
                />
                {errors.primaryDimension && <FormFeedback>{errors.primaryDimension.message}</FormFeedback>}
              </div>

              <div>
                <Label>QUANTITY</Label>
                <Controller
                  name="quantity"
                  disabled={0 || activeTab !== 'stock'}
                  control={control}
                  rules={{ required: activeTab === 'stock' }}
                  render={({ field }) => (
                    <Input {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setValue('uom', '')
                        setValue('customQuantity', e.target.value)
                      }}
                      aria-invalid={!!errors.quantity}
                      type="number" />
                  )}
                />
                {errors.quantity && <FormFeedback>{errors.quantity.message}</FormFeedback>}
              </div>

              <div>
                <Label>UOM</Label>
                <Controller
                  name="uom"
                  control={control}
                  disabled={grades?.[0]?.type === 'pipe-fitting' || activeTab !== 'stock'}
                  render={({ field }) => (
                    <Select {...field}
                      value={field.value}
                      aria-invalid={!!errors.uom}
                    >
                      <SelectOption disabled value="">Select...</SelectOption>
                      {UomOptions?.map((item, index) => (<SelectOption key={index} value={item.value}>{item.label}</SelectOption>))}
                    </Select>
                  )}
                />
                {errors.uom && <FormFeedback>{errors.uom.message}</FormFeedback>}
              </div>
            </div>
            <div className=''>
              <div>
                {toleranceData?.tolerance && (
                  <div className="pt-3">
                    <div className="flex gap-2 items-center flex-wrap mb-4">
                      <Button
                        type="button"
                        size="sm"
                        className="whitespace-nowrap"
                        variant={activeTab === 'stock' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('stock')}
                      >
                        Stock Size
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="whitespace-nowrap"
                        variant={activeTab === 'custom' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('custom')}
                      >
                        Custom Cut
                      </Button> <span>T.I.'s Value Added Cutting Services</span>
                    </div>

                    <div>
                      {activeTab === 'stock' && (
                        <div className="tab-content">
                          <div className="text-start flex flex-col gap-1 mt-3">
                            {renderLengthWithTolerance(toleranceData)}
                            {renderWidthWithTolerance(toleranceData)}
                          </div>
                        </div>
                      )}
                      {activeTab === 'custom' && (
                        <div className="tab-content flex flex-col gap-3">
                          <div className="max-w-72">
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
                                  aria-invalid={!!errors.cutLength}
                                  type="number"
                                />
                              )}
                            />
                            {errors.cutLength && (
                              <FormFeedback>{errors.cutLength.message}</FormFeedback>
                            )}
                          </div>
                          <div className="max-w-72">
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
              {totalQuantity &&
                <div className='mt-3 space-x-3 '>
                  <Button type="submit"  >+ Add to Quote</Button>  <Button type='reset' variant='secondary' onClick={() => {
                    reset()
                    setToleranceData(null)
                    setActiveTab('stock')
                  }} >Reset</Button>
                </div>}
            </div>
          </div>
        </div>
      </form >
      {/* Step 3: Finalize Quote */}
      <div div className="text-center mt-4" >
        {
          tableData?.length > 0 && <div className='pb-2  bg-gradient-to-r from-gray-100 to-gray-200 p-2 rounded-lg'>
            <Table>
              <TableHeader>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Sub Total</TableHead>
              </TableHeader>
              {tableData?.map((item, index) => (
                <TableBody key={index}>
                  <TableRow>
                    <TableCell>
                      {item?.alloyFamily}, {item?.productForm}, {item?.primaryDimension}{" "}
                      {(item?.lengthTolerance && item?.lengthTolerance !== 'NaN\"') ? `±${item?.lengthTolerance}` : ""}, {item?.grade}{" "}
                      <br />
                      {item?.specifications}
                      <br />
                      {item?.identifier === "Excess" ? (
                        <span className="text-danger">
                          Clearance
                          <br />
                          <Link href={"/customer/discounted-products"} className="text-danger underline">
                            View more Clearance items here
                          </Link>
                        </span>
                      ) : (
                        ""
                      )}
                    </TableCell>

                    <TableCell>
                      {editIndex === index ? (
                        <>
                          <Input
                            type="number"
                            value={editRow.quantity}
                            onChange={(e) => setEditRow({ ...editRow, quantity: e.target.value })}
                          />
                          {item?.cutLength ? <>
                            Length (inches):
                            <Input
                              type="number"
                              value={editRow.cutLength}
                              onChange={(e) => setEditRow({ ...editRow, cutLength: e.target.value })}
                            />
                          </> :
                            <Select
                              value={editRow?.uom}
                              onChange={(selected) => setEditRow({ ...editRow, uom: selected.target.value })}
                            >
                              <SelectOption disabled value="">Select...</SelectOption>
                              {UomOptions?.map((item, index) => (<SelectOption key={index} value={item.value}>{item.label}</SelectOption>))}
                            </Select>}
                        </>
                      ) : (
                        <>
                          {item?.cutLength ? <>
                            {item?.quantity} <br />
                            Length: {item?.cutLength} {item?.uom}
                          </> :
                            `${item?.quantity} ${item?.uom}`}
                        </>
                      )}
                    </TableCell>

                    <TableCell>
                      {editIndex === index ? (
                        <>
                          <Input
                            type="number"
                            value={editRow.prices.price}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                prices: { ...editRow.prices, price: e.target.value },
                              })
                            }
                          />
                        </>
                      ) : (<>
                        {item?.oldPrices?.price ? <>
                          {item?.oldPrices?.price === item?.prices.price ?
                            `$${Number(item?.prices.price).toFixed(2)}` :
                            <>
                              <span className='text-danger'>Override Price:</span><br />
                              ${Number(item?.prices.price).toFixed(2)}<br />
                              <span>Standard:</span><br />
                              ${Number(item?.oldPrices.price).toFixed(2)}
                            </>}
                        </> :
                          `$${Number(item?.prices.price).toFixed(2)}`}
                      </>
                      )}
                    </TableCell>

                    <TableCell>
                      ${(
                        Number(item?.prices.price) * Number(item?.quantity)
                      ).toFixed(2)}
                    </TableCell>

                    <TableCell className="p-0">
                      {quote?.status === 'pending' && <div className="flex flex-col gap-2">
                        {editIndex === index ? (
                          <>
                            <Button onClick={handleSaveEdit} className="px-2 py-1 h-auto">
                              <Check size={18} />
                            </Button>
                            <Button onClick={handleCancelEdit} className="px-2 py-1 h-auto" variant="secondary" >
                              <ArrowLeft size={18} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => handleEditClick(index)} className="px-2 py-1 h-auto">
                              <Pencil size={18} />
                            </Button>
                            <Button onClick={() => handleRemove(index)} variant="secondary" className="px-2 py-1 h-auto">
                              <X size={18} />
                            </Button>
                          </>
                        )}
                      </div>}
                    </TableCell>
                  </TableRow>
                  {item?.cutLength && <TableRow className="p-0"> <TableCell colspan={5} className="bg-white text-center py-1 rounded-md" > <FormFeedback className="p-0 m-0">Cut Length (Inches): {item?.cutLength} {item?.uom}, QTY: {item?.quantity}   </FormFeedback> </TableCell> </TableRow>}
                  {item?.cutLength && <TableRow className="p-0"> <TableCell colspan={5} className="bg-white text-center py-1 rounded-md" > <FormFeedback className="p-0 m-0">Cutting costs are included in the above quote.  All pricing quoted subject to T.I. salesperson validation during order confirmation and contract review.</FormFeedback> </TableCell> </TableRow>}
                </TableBody>
              ))}
            </Table>
            <div className=" text-lg font-bold ms-auto flex items-end flex-col mt-4">
              {quote?.frieght > 0 && <>

                <div className='flex gap-3'>
                  <div>Subtotal:
                    <span className="text-base font-normal">
                      {quote?.user?.discount ? `(${quote?.user?.discount}%)` : ''}
                    </span>
                  </div>
                  <div className="text-blue-600 ">${quote?.subtotal?.toFixed(2)}</div>
                </div>
                <div className='flex gap-3'>
                  <div>Frieght: </div>
                  <div className="text-blue-600">${quote?.frieght?.toFixed(2) || '0.00'}</div>
                </div>
              </>}
              {/* <div className='flex gap-3'>
                <div>Tax: </div>
                <div className="text-blue-600">${taxAmount?.toFixed(2) || '0.00'}</div>
              </div> */}
              <div className='flex gap-3'>
                <div>Quote Total : </div>
                <div className="text-blue-600">${(taxAmount + totalAmount)?.toFixed(2)}</div>
              </div>
            </div>
          </div>
        }
        {quote?.notes && <p className='text-danger my-5 text-sm'>Notes: {quote?.notes}</p>}
      </div >
    </>
  );
}
