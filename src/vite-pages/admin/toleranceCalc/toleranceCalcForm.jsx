'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import ApiFunction from '@/lib/api/apiFuntions';
import Select from 'react-select';
import { Plus, Trash2, X } from 'lucide-react';
import { productForms } from '@/components/tools/calculator/constants';
import toast from 'react-hot-toast';
import { handleError } from '@/lib/api/errorHandler';
import { newMetalFamily, units } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';

export function ToleranceWeightForm({ rowData }) {
    const { back } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDimensionType, setSelectedDimensionType] = useState(null);
    const [calData, setCalData] = useState([]);

    const getUnique = (array, key) => {
        return [...new Set(array.map(item => item[key]))];
    };
    const metalFamily = getUnique(calData, 'alloyFamily')
    const { post, put, get } = ApiFunction();

    const dimensionTypeOptions = [
        { value: 'width', label: 'Width' },
        { value: 'thickness', label: 'Thickness' },
        { value: 'hexAF', label: 'Hex AF' },
        { value: 'diameter', label: 'Diameter' },
        { value: 'length', label: 'Length' },
        { value: 'outsideDiameter', label: 'Outside Diameter' },
        { value: 'insideDiameter', label: 'Inside Diameter' },
        { value: 'wallTickness', label: 'Wall Tickness' },
    ];

    const schema = z.object({
        alloyFamily: z.array(z.object({
            value: z.string(),
            label: z.string()
        })).min(1, { message: 'At least one alloy family is required' }),

        alloyType: z.array(z.object({
            value: z.string(),
            label: z.string()
        })).optional(),

        dimensionType: z.object({
            value: z.string(),
            label: z.string()
        }).refine(data => !!data.value, { message: 'Dimension Type is required' }),

        unit: z.object({
            value: z.string(),
            label: z.string()
        }).refine(data => !!data.value, { message: 'Unit is required' }),

        outsideDiameter: selectedDimensionType === 'outsideDiameter' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one Outside Diameter is required' }) : z.array().optional(),
        insideDiameter: selectedDimensionType === 'insideDiameter' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one Inside Diameter is required' }) : z.array().optional(),
        wallTickness: selectedDimensionType === 'wallTickness' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one Wall Tickness is required' }) : z.array().optional(),
        width: selectedDimensionType === 'width' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one width is required' }) : z.array().optional(),

        thickness: selectedDimensionType === 'thickness' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one thickness is required' }) : z.array().optional(),

        hexAF: selectedDimensionType === 'hexAF' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one hexAF is required' }) : z.array().optional(),

        diameter: selectedDimensionType === 'diameter' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one diameter is required' }) : z.array().optional(),

        length: selectedDimensionType === 'length' ? z.array(z.object({
            min: z.number().min(0),
            max: z.number().min(0),
            tolerance: z.number().min(0)
        })).min(1, { message: 'At least one length is required' }) : z.array().optional()
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            alloyFamily: [],
            alloyType: [],
            dimensionType: null,
            unit: { value: 'in', label: 'inches' },
            width: [],
            thickness: [],
            hexAF: [],
            diameter: [],
            length: [],
        }
    });

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
        fetchMetalFamily()
    }, []);
    // Watch dimensionType to update field arrays
    const watchedDimensionType = watch('dimensionType');
    const handleReset = () => {
        setValue('width', [])
        setValue('thickness', [])
        setValue('hexAF', [])
        setValue('diameter', [])
        setValue('length', [])
    }

    // Set up field arrays for dynamic fields
    const widthFieldArray = useFieldArray({
        control,
        name: 'width'
    });

    const thicknessFieldArray = useFieldArray({
        control,
        name: 'thickness'
    });

    const hexAFFieldArray = useFieldArray({
        control,
        name: 'hexAF'
    });

    const diameterFieldArray = useFieldArray({
        control,
        name: 'diameter'
    });

    const lengthFieldArray = useFieldArray({
        control,
        name: 'length'
    });

    // Get the active field array based on selected dimension type
    const getActiveFieldArray = () => {
        switch (selectedDimensionType) {
            case 'width':
                return widthFieldArray;
            case 'thickness':
                return thicknessFieldArray;
            case 'hexAF':
                return hexAFFieldArray;
            case 'diameter':
                return diameterFieldArray;
            case 'length':
                return lengthFieldArray;
            default:
                return null;
        }
    };

    // Add a new dimension entry
    const addDimensionEntry = () => {
        const activeFieldArray = getActiveFieldArray();
        if (activeFieldArray) {
            activeFieldArray.append({
                min: '',
                max: '',
                tolerance: ''
            });
        }
    };

    // Load data if editing
    useEffect(() => {
        if (rowData) {
            // Transform rowData to match form structure
            const formattedData = {
                alloyFamily: rowData.alloyFamily?.map(af => ({ value: af, label: af })) || [],
                alloyType: rowData.alloyType?.map(at => ({ value: at, label: at })) || [],
                unit: units.find(item => item.value === rowData?.unit)
            };

            // Load dimension data if exists
            ['width', 'thickness', 'hexAF', 'diameter', 'length'].forEach(dimType => {
                if (rowData[dimType] && rowData[dimType].length > 0) {
                    formattedData[dimType] = rowData[dimType];
                    formattedData.dimensionType = { value: dimType, label: dimType.charAt(0).toUpperCase() + dimType.slice(1) };
                    setSelectedDimensionType(dimType);
                }
            });

            reset(formattedData);
        }
    }, [rowData, reset]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Transform data to match API expectations
            const formData = {
                alloyFamily: data.alloyFamily.map(item => item.value),
                alloyType: data.alloyType?.map(item => item.value) || [],
                type: selectedDimensionType,
                unit: data?.unit?.value
            };

            // Add dimensions data
            if (data.dimensionType) {
                const dimType = data.dimensionType.value;
                formData[dimType] = data[dimType];
            }

            if (rowData?._id) {
                await put(`tol-weigth/edit/${rowData._id}`, formData)
                    .then((result) => {
                        if (result.success) {
                            toast.success(result.message)
                            back();
                        }
                    }).catch((err) => {
                        handleError(err)
                    });
            } else {
                await post('tol-weigth/create', formData)
                    .then((result) => {
                        if (result.success) {
                            toast.success(result.message)
                            back();
                        }
                    }).catch((err) => {
                        handleError(err)
                    });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full px-2 sm:px-4 md:px-6">
            <div className="w-full space-y-6 md:space-y-8">
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1  gap-x-3 gap-y-4'>
                        {/* Alloy Family - Multiple Select (Required) */}
                        <div className="w-full">
                            <Label htmlFor="alloyFamily" className="mb-1 block">Alloy Family <span className="text-red-500">*</span></Label>
                            <Controller
                                name="alloyFamily"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={productForms}
                                        isMulti
                                        isClearable
                                        placeholder="Select Alloy Families"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                            {errors.alloyFamily && <FormFeedback>{errors.alloyFamily.message}</FormFeedback>}
                        </div>

                        {/* Alloy Type - Multiple Select */}
                        <div className="w-full">
                            <Label htmlFor="alloyType" className="mb-1 block">Alloy Type</Label>
                            <Controller
                                name="alloyType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={metalFamily?.map(item => ({ label: item, value: item }))}
                                        isMulti
                                        isClearable
                                        placeholder="Select Alloy Types"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                        </div>

                        {/* Dimension Type Selector */}
                        <div className="w-full">
                            <Label htmlFor="dimensionType" className="mb-1 block">Dimension Type <span className="text-red-500">*</span></Label>
                            <Controller
                                name="dimensionType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isClearable
                                        options={dimensionTypeOptions}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setSelectedDimensionType(e?.value)
                                            handleReset()
                                        }}
                                        placeholder="Select Dimension Type"
                                        className="basic-select"
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                            {errors.dimensionType && <FormFeedback>{errors.dimensionType.message}</FormFeedback>}
                        </div>
                        {/* <div className="w-full">
                            <Label htmlFor="unit" className="mb-1 block">Select Unit <span className="text-red-500">*</span></Label>
                            <Controller
                                name="unit"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isClearable
                                        options={units}
                                        placeholder="Select Unit"
                                        className="basic-select"
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                            {errors.unit && <FormFeedback>{errors.unit.message}</FormFeedback>}
                        </div> */}
                    </div>

                    {/* Dynamic Dimension Fields */}
                    {selectedDimensionType && (
                        <div className="mt-4 md:mt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4">
                                <h3 className="text-base md:text-lg font-semibold capitalize mb-2 sm:mb-0">{selectedDimensionType} Dimensions</h3>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addDimensionEntry}
                                    className="flex items-center text-xs sm:text-sm"
                                >
                                    <Plus size={16} className="mr-1" /> Add Range
                                </Button>
                            </div>

                            {/* Render based on selected dimension type */}
                            {selectedDimensionType === 'width' && widthFieldArray.fields.map((field, index) => (
                                <DimensionFieldSet
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    fieldArrayName="width"
                                    remove={() => widthFieldArray.remove(index)}
                                    errors={errors}
                                />
                            ))}

                            {selectedDimensionType === 'thickness' && thicknessFieldArray.fields.map((field, index) => (
                                <DimensionFieldSet
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    fieldArrayName="thickness"
                                    remove={() => thicknessFieldArray.remove(index)}
                                    errors={errors}
                                />
                            ))}

                            {selectedDimensionType === 'hexAF' && hexAFFieldArray.fields.map((field, index) => (
                                <DimensionFieldSet
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    fieldArrayName="hexAF"
                                    remove={() => hexAFFieldArray.remove(index)}
                                    errors={errors}
                                />
                            ))}

                            {selectedDimensionType === 'diameter' && diameterFieldArray.fields.map((field, index) => (
                                <DimensionFieldSet
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    fieldArrayName="diameter"
                                    remove={() => diameterFieldArray.remove(index)}
                                    errors={errors}
                                />
                            ))}

                            {selectedDimensionType === 'length' && lengthFieldArray.fields.map((field, index) => (
                                <DimensionFieldSet
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    fieldArrayName="length"
                                    remove={() => lengthFieldArray.remove(index)}
                                    errors={errors}
                                />
                            ))}

                            {getActiveFieldArray()?.fields.length === 0 && (
                                <div className="bg-gray-50 p-3 md:p-4 rounded-md text-center text-sm">
                                    No dimension ranges added. Click "Add Range" to begin.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex pt-3 md:pt-4'>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            size='sm'
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : rowData ? 'Update Tolerance Weight' : 'Add Tolerance Weight'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Dimension Field Set Component for reuse
const DimensionFieldSet = ({ control, index, fieldArrayName, remove, errors }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 p-3 bg-gray-50 rounded-md relative">
            <div className="w-full">
                <Label htmlFor={`${fieldArrayName}.${index}.min`} className="mb-1 block text-sm">Min Value <span className="text-red-500">*</span></Label>
                <Controller
                    name={`${fieldArrayName}.${index}.min`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            step="0.0001"
                            placeholder="Min"
                            min="0"
                            className="text-sm"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                    )}
                />
                {errors[fieldArrayName]?.[index]?.min && (
                    <FormFeedback>{errors[fieldArrayName][index].min.message}</FormFeedback>
                )}
            </div>

            <div className="w-full">
                <Label htmlFor={`${fieldArrayName}.${index}.max`} className="mb-1 block text-sm">Max Value <span className="text-red-500">*</span></Label>
                <Controller
                    name={`${fieldArrayName}.${index}.max`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            step="0.0001"
                            placeholder="Max"
                            min="0"
                            className="text-sm"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                    )}
                />
                {errors[fieldArrayName]?.[index]?.max && (
                    <FormFeedback>{errors[fieldArrayName][index].max.message}</FormFeedback>
                )}
            </div>

            <div className="w-full">
                <Label htmlFor={`${fieldArrayName}.${index}.tolerance`} className="mb-1 block text-sm">Tolerance <span className="text-red-500">*</span></Label>
                <Controller
                    name={`${fieldArrayName}.${index}.tolerance`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder="Tolerance"
                            min="0"
                            step="0.0001"
                            className="text-sm"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                    )}
                />
                {errors[fieldArrayName]?.[index]?.tolerance && (
                    <FormFeedback>{errors[fieldArrayName][index].tolerance.message}</FormFeedback>
                )}
            </div>

            <div className=" absolute -top-1 left-auto -right-3">
                <Button
                    type="button"
                    onClick={remove}
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700 h-7 w-7 text-xs sm:text-sm p-1"
                >
                    <X size={16} className="" />
                </Button>
            </div>
        </div>
    );
};