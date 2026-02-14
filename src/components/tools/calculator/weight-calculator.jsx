'use client'
import { useCallback, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Calculator, RotateCcw, Scale, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  productForms,
  tolerances,
  units,
  dimensionTolerances
} from './constants';
import { calculateWeight, convertToInches } from './utils';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiFunction from '@/lib/api/apiFuntions';
import { newMetalFamily } from '@/lib/utils/constants';

// Component to render dimension inputs for specific product forms
const DimensionInputs = ({ productForm, tolerance, register, diameterTol, lengthTol, selectProductData, hexAFTol, thicknessTol, widthTol, diameterUnit
  , lengthUnit
  , outsideDiameterUnit
  , wallTicknessUnit
  , insideDiameterUnit
  , thicknessUnit
  , hexAFUnit
  , widthUnit, outsideDiameterTol, wallTicknessTol, insideDiameterTol }) => {
  // Get tolerance values for display
  const getToleranceText = (unit, value) => {
    if (tolerance === 'with') {
      // Extract value and unit from the tolerance object
      // Format as a string
      return `±${value} ${unit}`;
    }
    return null;
  };

  // Get tolerance tooltip
  const getToleranceTooltip = (dimension, value) => {
    const toleranceText = getToleranceText(dimension, value);
    if (!toleranceText) return null;

    return (
      <Badge variant="outline" className="inline-flex items-center text-base">
        {toleranceText}
      </Badge>
    );
  };

  // Default case for Round Bar
  return (
    <>
      {selectProductData?.dimensions?.includes('diameter') &&
        <div className="space-y-2">
          <Label>
            Diameter {getToleranceTooltip(diameterUnit, diameterTol || 0)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Enter diameter"
              className="flex-1"
              {...register('dimensions.diameter.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.diameter.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
      {selectProductData?.dimensions?.includes('hexAF') &&
        <div className="space-y-2">
          <Label>
            Across Flats Hex Dimension {getToleranceTooltip(hexAFUnit, hexAFTol || 0)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Across Flats Hex Dimension"
              className="flex-1"
              {...register('dimensions.hexAF.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.hexAF.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
      {selectProductData?.dimensions?.includes('thickness') &&
        <div className="space-y-2">
          <Label>
            Thickness {getToleranceTooltip(thicknessUnit, thicknessTol || 0)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Thickness"
              className="flex-1"
              {...register('dimensions.thickness.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.thickness.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
      {selectProductData?.dimensions?.includes('width') &&
        <div className="space-y-2">
          <Label>
            Width {getToleranceTooltip(widthUnit, widthTol || 0)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Width"
              className="flex-1"
              {...register('dimensions.width.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.width.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}

      {selectProductData?.dimensions?.includes('inside-diameter') &&
        <div className="space-y-2">
          <Label>
            Inside Diameter {getToleranceTooltip(insideDiameterUnit, diameterTol || 0, insideDiameterTol)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Inside Diameter"
              className="flex-1"
              {...register('dimensions.insideDiameter.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.insideDiameter.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
      {selectProductData?.dimensions?.includes('wall-thickness') &&
        <div className="space-y-2">
          <Label>
            Wall Thickness {getToleranceTooltip(wallTicknessUnit, diameterTol || 0, wallTicknessTol)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Wall Thickness"
              className="flex-1"
              {...register('dimensions.wallTickness.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.wallTickness.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
      {selectProductData?.dimensions?.includes('outer-diameter') &&
        <div className="space-y-2">
          <Label>
            Outside Diameter {getToleranceTooltip(outsideDiameterUnit, diameterTol || 0, outsideDiameterTol)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.0001"
              placeholder="Outside Diameter"
              className="flex-1"
              {...register('dimensions.outsideDiameter.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.outsideDiameter.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
      {selectProductData?.dimensions?.includes('length') &&
        <div className="space-y-2">
          <Label>
            Length {getToleranceTooltip(lengthUnit, lengthTol || 0)}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.001"
              placeholder="Enter length"
              className="flex-1"
              {...register('dimensions.length.value', {
                valueAsNumber: true,
                required: true
              })}
            />
            <Select
              className="w-24"
              {...register('dimensions.length.unit', { required: true })}
            >
              {units.map(unit => (
                <SelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectOption>
              ))}
            </Select>
          </div>
        </div>}
    </>
  );
  // Add other product form dimension inputs here as needed
  // For example: Flat Bar, Hex Bar, Sheet, etc.
};

export function WeightCalculator() {
  const [weightResult, setWeightResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [tolData, setTolData] = useState([]);
  const [calData, setCalData] = useState([]);
  const { get } = ApiFunction()
  const getUnique = (array, key) => {
    return [...new Set(array.map(item => item[key]))];
  };
  const methods = useForm({
    defaultValues: {
      productForm: '',
      metalFamily: '',
      grade: '',
      tolerance: 'with',
      dimensions: {
        diameter: { value: 1, unit: 'in' },
        length: { value: 1, unit: 'in' },
        width: { value: 1, unit: 'in' },
        hexAF: { value: 1, unit: 'in' },
        thickness: { value: 1, unit: 'in' },
        wallTickness: { value: 1, unit: 'in' },
        insideDiameter: { value: 1, unit: 'in' },
        outsideDiameter: { value: 1, unit: 'in' },
      },
      quantity: 1
    },
    mode: 'onChange'
  });

  const { setValue, watch } = methods;


  const selectedProductForm = watch('productForm');
  const selectedMetalFamily = watch('metalFamily');
  const selectedGrade = watch('grade');
  const selectedTolerance = watch('tolerance');
  /// value
  const diameterValue = watch('dimensions.diameter.value');
  const lengthValue = watch('dimensions.length.value');

  const outsideDiameterValue = watch('dimensions.outsideDiameter.value');
  const wallTicknessValue = watch('dimensions.wallTickness.value');
  const insideDiameterValue = watch('dimensions.insideDiameter.value');

  const thicknessValue = watch('dimensions.thickness.value');
  const hexAFValue = watch('dimensions.hexAF.value');
  const widthValue = watch('dimensions.width.value');

  /// units

  const diameterUnit = watch('dimensions.diameter.unit');
  const lengthUnit = watch('dimensions.length.unit');
  const outsideDiameterUnit = watch('dimensions.outsideDiameter.unit');
  const wallTicknessUnit = watch('dimensions.wallTickness.unit');
  const insideDiameterUnit = watch('dimensions.insideDiameter.unit');

  const thicknessUnit = watch('dimensions.thickness.unit');
  const hexAFUnit = watch('dimensions.hexAF.unit');
  const widthUnit = watch('dimensions.width.unit');


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

  function getTolerance(value, ranges, unit) {
    const valueInInches = convertToInches(value, unit);

    const sorted = ranges
      .map(r => ({
        ...r,
        min: convertToInches(r.min, r.unit),
        max: convertToInches(r.max, r.unit),
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
  const selectProductData = productForms?.find(item => item.value === selectedProductForm) || null
  const metalFamily = getUnique(calData, 'alloyFamily')
  const gradeData = selectedMetalFamily ? getUnique(calData?.filter(item => item.alloyFamily === selectedMetalFamily), 'alloyType') : []
  const densityData = calData?.find(item => (item.alloyFamily === selectedMetalFamily && item.alloyType === selectedGrade))
  const alloyData = filterAlloyData(tolData, selectedMetalFamily)

  const diameterTol = alloyData?.diameter?.length > 0 ? getTolerance(diameterValue, alloyData?.diameter || [], diameterUnit) : null
  const lengthTol = alloyData?.length?.length > 0 ? getTolerance(lengthValue, alloyData?.length || [], lengthUnit) : null
  const hexAFTol = alloyData?.hexAF?.length > 0 ? getTolerance(hexAFValue, alloyData?.hexAF || [], hexAFUnit) : null
  const thicknessTol = alloyData?.thickness?.length > 0 ? getTolerance(thicknessValue, alloyData?.thickness || [], thicknessUnit) : null
  const widthTol = alloyData?.width?.length > 0 ? getTolerance(widthValue, alloyData?.width || [], widthUnit) : null
  const insideDiameterTol = alloyData?.outsideDiameter?.length > 0 ? getTolerance(outsideDiameterValue, alloyData?.outsideDiameter || [], outsideDiameterUnit) : null
  const wallTicknessTol = alloyData?.wallTickness?.length > 0 ? getTolerance(wallTicknessValue, alloyData?.wallTickness || [], wallTicknessUnit) : null
  const outsideDiameterTol = alloyData?.insideDiameter?.length > 0 ? getTolerance(insideDiameterValue, alloyData?.insideDiameter || [], insideDiameterUnit) : null

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

  const fetchTolerance = useCallback(async () => {
    if (!selectedProductForm || !selectProductData) {
      return
    }
    let queryData = {
      alloyFamily: { $in: [selectedProductForm] }
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
  }, [selectedProductForm])
  const isFormValid = selectedProductForm &&
    selectedMetalFamily &&
    selectedGrade &&
    selectedTolerance;

  const onSubmit = methods.handleSubmit((data) => {
    const dimensions = selectProductData?.dimensions || [];

    // Map each possible dimension to its value, tolerance, and unit
    const dimensionMap = {
      'diameter': {
        value: diameterValue,
        tolerance: diameterTol,
        unit: diameterUnit,
      },
      'outer-diameter': {
        value: outsideDiameterValue,
        tolerance: 0,
        unit: outsideDiameterUnit,
      },
      'wall-thickness': {
        value: wallTicknessValue,
        tolerance: 0,
        unit: wallTicknessUnit,
      },
      'inside-diameter': {
        value: insideDiameterValue,
        tolerance: 0,
        unit: insideDiameterUnit,
      },
      'thickness': {
        value: thicknessValue,
        tolerance: thicknessTol,
        unit: thicknessUnit,
      },
      'hexAF': {
        value: hexAFValue,
        tolerance: hexAFTol,
        unit: hexAFUnit,
      }
    };

    let M3Value = 0;
    let N3Value = 0;

    for (const key of Object.keys(dimensionMap)) {
      if (dimensions.includes(key)) {
        const { value, tolerance, unit } = dimensionMap[key];
        M3Value = convertToInches(value, unit);
        N3Value = tolerance;
        break; // Use the first matched dimension
      }
    }
    const L = convertToInches(lengthValue, lengthUnit);
    const O3 = convertToInches(widthValue, widthUnit);

    const result = calculateWeight(
      data.productForm,
      data.metalFamily,
      {
        M3: M3Value,
        L,
        N3: N3Value,
        LT: lengthTol,
        O3,
        P3: widthTol,
        S3: Number(densityData?.densityKg)
      },
      data.quantity,
      data.tolerance === 'with'
    );

    setWeightResult(result);
  });
  const resetForm = () => {
    methods.reset();
    setWeightResult(null);
  };
  useEffect(() => {
    fetchMetalFamily()
  }, []);
  useEffect(() => {
    fetchTolerance()
  }, [selectedProductForm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Form Section */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <span>Metal Weight Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Product Form Selection */}
                  <div className="space-y-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Product Form
                    </Label>
                    <Select
                      {...methods.register('productForm', { required: true })}
                    >
                      <SelectOption value="">Select Product Form</SelectOption>
                      {productForms.map(form => (
                        <SelectOption key={form.value} value={form.value}>{form.label}</SelectOption>
                      ))}
                    </Select>
                  </div>

                  {/* Metal Family Selection */}
                  <div className="space-y-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Metal Family
                    </Label>
                    <Select
                      {...methods.register('metalFamily', { required: true })}
                      disabled={!selectedProductForm}
                    >
                      <SelectOption value="">Select Metal Family</SelectOption>
                      {metalFamily?.map(metal => (
                        <SelectOption key={metal} value={metal}>{metal}</SelectOption>
                      ))}
                    </Select>
                  </div>

                  {/* Grade Selection */}
                  <div className="space-y-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Grade/Alloy
                    </Label>
                    <Select
                      {...methods.register('grade', { required: true })}
                      disabled={!selectedMetalFamily}
                    >
                      <SelectOption value="">Select Grade/Alloy</SelectOption>
                      {gradeData?.map(grade => (
                        <SelectOption key={grade} value={grade}>{grade}</SelectOption>
                      ))}
                    </Select>
                  </div>

                  {/* Tolerance Selection */}
                  <div className="space-y-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Tolerance
                    </Label>
                    <Select
                      {...methods.register('tolerance', { required: true })}
                      disabled={!selectedGrade}
                    >
                      {tolerances.map(tolerance => (
                        <SelectOption key={tolerance.value} value={tolerance.value}>
                          {tolerance.label}
                        </SelectOption>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Dimensions Section - Shown when all selections are made */}
                {(selectedTolerance && selectedGrade) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DimensionInputs
                        productForm={selectedProductForm}
                        selectProductData={selectProductData}
                        tolerance={selectedTolerance}
                        diameterTol={diameterTol}
                        widthTol={widthTol}
                        thicknessTol={thicknessTol}
                        hexAFTol={hexAFTol}
                        lengthTol={lengthTol}
                        outsideDiameterTol={outsideDiameterTol}
                        wallTicknessTol={wallTicknessTol}
                        insideDiameterTol={insideDiameterTol}

                        diameterUnit={diameterUnit}
                        lengthUnit={lengthUnit}
                        outsideDiameterUnit={outsideDiameterUnit}
                        wallTicknessUnit={wallTicknessUnit}
                        insideDiameterUnit={insideDiameterUnit}
                        thicknessUnit={thicknessUnit}
                        hexAFUnit={hexAFUnit}
                        widthUnit={widthUnit}

                        register={methods.register}
                        setValue={setValue}
                      />

                      <div className="space-y-2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Quantity
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          defaultValue="1"
                          {...methods.register('quantity', {
                            valueAsNumber: true,
                            required: true,
                            min: 1
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-base font-medium transition-colors"
                    disabled={!isFormValid || isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <span className="animate-spin">
                          <RotateCcw className="h-4 w-4" />
                        </span>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4" />
                        Calculate Weight
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="sm:w-32 flex items-center justify-center gap-2 py-3 rounded-md text-base font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Product Image and Results */}
      <div className="lg:col-span-1">
        <div className="space-y-6 sticky top-24">
          {/* Product Image Card */}
          {selectProductData && (
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <img
                  src={selectProductData?.img}
                  alt={selectProductData?.label}
                  className="max-h-60 h-full  w-auto object-contain"
                />
              </CardContent>
            </Card>
          )}
          {/* Results Card */}
          {weightResult && (
            <Card className="border-blue-200">
              <CardHeader className="border-b border-blue-200 bg-blue-50">
                <CardTitle className="text-blue-800">Weight Results</CardTitle>
              </CardHeader>
              <CardContent>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total Weight</span>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-blue-600">
                        {weightResult.totalWeight.lbs}
                      </span>
                      <span className="text-lg ml-1">lbs</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({weightResult.totalWeight.kg} kg)
                    </span>
                  </div>

                  <div className="pt-2 border-t border-blue-100">
                    <span className="text-sm text-gray-500">Per Piece</span>
                    <div className="flex items-baseline">
                      <span className="text-xl font-semibold text-blue-600">
                        {weightResult.pieceWeight.lbs}
                      </span>
                      <span className="text-base ml-1">lbs</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({weightResult.pieceWeight.kg} kg)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
