'use client'
import React, { Fragment, useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { CloudFog, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectOption } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { handleError } from "../api/errorHandler";
import ApiFunction from "../api/apiFuntions";
import { uploadDoc } from "../api/uploadFile";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'; // Update this path to where you've placed the Dialog component

const schema = z.object({
    type: z.string().min(1, "Product type is required"),
    productFile: z.string().min(0).optional(),
    file: z.any().refine((file) => file.length > 0, "File is required"),
});
const generateNewUniqueIDExcel = (row) => {
    // Function to normalize column names
    const normalizeColumnName = (name) =>
        name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ") // Normalize multiple spaces to a single space
            .replace(/[\r\n]+/g, ""); // Remove line breaks
    const normalizedRow = {};
    // Normalize row keys to match normalized column names
    Object.keys(row).forEach((key) => {
        normalizedRow[normalizeColumnName(key)] = row[key];
    });
    // Apply normalization to column names
    const trimColumnNames = (columns) => columns.map(normalizeColumnName);

    // List of column names to normalize
    const columnsToNormalize = trimColumnNames([
        "Metal - Alloy Family",
        "Product",
        "Grade / Alloy",
        "Specification Details",
        "Primary Dimension",
    ]);

    const metalAlloyFamily = normalizedRow[columnsToNormalize[0]];
    const product = normalizedRow[columnsToNormalize[1]];
    const gradeAlloy = normalizedRow[columnsToNormalize[2]];
    const specificationDetails = normalizedRow[columnsToNormalize[3]];
    const primaryDimension = normalizedRow[columnsToNormalize[4]];
    if (!metalAlloyFamily || !gradeAlloy || !specificationDetails || !primaryDimension) {
        throw new Error("Missing required fields for generating Unique ID.");
    }

    // Extract the first digit from each word in Specification Details
    const specDetailsWords = specificationDetails.split(" ");
    const firstDigits = specDetailsWords
        .map((word) => word.match(/\d/))
        .filter((match) => match)
        .map((match) => match[0]);

    // Combine the fields to generate the new unique ID
    return `${metalAlloyFamily}/${product}/${gradeAlloy}/${firstDigits.join("")}/${primaryDimension}`;
};
const ExcelProcessor = ({ handleGetProduct }) => {
    const [structuredData, setStructuredData] = useState([]);
    const [pricesData, setPricesData] = useState([]);
    const [toleranceData, setToleranceData] = useState([]);
    const [discountedData, setDiscountedData] = useState([]);
    const fileInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const { post, get } = ApiFunction()
    const [uploadedFileDetail, setUploadedFileDetail] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            type: "",
            file: [],
        },
    });
    function closeModal() {
        setIsOpen(false)
        setStructuredData([])
        setPricesData([])
        setToleranceData([])
        reset()
    }
    const file = watch('file')
    const productFile = watch('productFile')
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setValue("file", [file]);
        setIsLoading(true);

        try {
            const fileExtension = file.name.split(".").pop().toLowerCase();

            if (fileExtension === "csv") {
                processCSV(file);
            } else if (fileExtension === "xlsx") {
                processXLSX(file);
            } else {
                e.target.value = '';
                setValue("file", null);
                throw { message: "Unsupported file format. Please upload CSV or XLSX." };
            }

            const result = await uploadDoc(file);
            if (result?.doc) {
                const fileInfo = {
                    name: file.name,
                    size: file.size,
                    type: fileExtension,
                    url: result.doc,
                };
                setUploadedFileDetail(fileInfo);
                setValue('productFile', result.doc); // optional if still used elsewhere
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const processCSV = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (result) => {
                try {
                    validateAndTransformData(result.data);
                } catch (error) {
                    throw new Error(error.message);
                }
            },
            skipEmptyLines: true,
        });
    };

    const processXLSX = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            try {
                validateAndTransformData(jsonData);
            } catch (error) {
                handleError(error)
                throw new Error(error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };
    const transformPriceData = (data, prodDiscount = []) => {
        const groupedData = {};

        data.forEach((item) => {
            const { uniqueID, priceLabel, prices } = item;

            // Find discount data for the current uniqueID
            const discountData = prodDiscount.find(d => d.uniqueID === uniqueID) || { identifier: null, quantity: 0 };

            // Initialize the group for the uniqueID if it doesn't exist
            if (!groupedData[uniqueID]) {
                groupedData[uniqueID] = {
                    uniqueID,
                    identifier: discountData.identifier,
                    available_quantity: discountData.quantity,
                    prices: [] // Collect all prices for the uniqueID
                };
            }

            // Add the current price data to the prices array
            groupedData[uniqueID].prices.push({
                priceLabel,
                price: prices?.[0] || null // Safely handle cases where prices might be undefined or empty
            });
        });

        // Convert groupedData from object to array
        return Object.values(groupedData);
    };

    const transformToleranceData = (data) => {
        const groupedData = {};

        data.forEach((item) => {
            const { uniqueID, toleranceLabel, value } = item;

            if (!groupedData[uniqueID]) {
                groupedData[uniqueID] = {
                    uniqueID,
                    tolerance: []
                };
            }

            groupedData[uniqueID].tolerance.push({
                label: toleranceLabel,
                value // Assuming the first item in the array is the price
            });
        });

        return Object.values(groupedData);
    };
    const validateAndTransformData = (data) => {
        const normalizeColumnName = (name) => {
            const value = name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ") // Normalize multiple spaces to a single space
                .replace(/[\r\n]+/g, ""); // Remove line breaks}
            return value
        }

        const trimColumnNames = (columns) => columns.map(normalizeColumnName);

        const columnsToAnalyze = trimColumnNames([
            "Metal - Alloy Family",
            "Product",
            "Grade / Alloy",
            "Specification Details",
            "Primary Dimension",
            "Unique Identifier (Stratix ID)",
        ]);

        const priceColumnPatterns = [
            /^\$\s*\/\s*lb\. Sales Price/i,
            /^\$\s*\/\s*Foot Sales Price/i,
            /^\$\s*\/\s*Inch Sales Price/i,
        ];

        const discountColumns = trimColumnNames([
            "Quantity Available (US Directory)",
            "Used for Margin Identifier Excess, TISH 64, TIRD 64, TIPL 64, MM, Other Ti",
        ]);
        const optionalColumns = trimColumnNames([
            "Quantity Available (US Directory)",
            "Used for Margin Identifier Excess, TISH 64, TIRD 64, TIPL 64, MM, Other Ti",
            "Unit of Measure",
            "Length",
            "Length Tolerance",
            "Diameter, Thickness, or OD",
            "Primary Dim 1 Tolerance",
            "density",
            "lbs./ft. with tolerances",
            "lbs./ft. \r\nw/o tolerances"
        ]);
        const lengthToleranceColumns = trimColumnNames([
            "Length",
            "Length Tolerance",
            "Width or Wall",
            "Secondary Dim 2 Tolerance",
            "Diameter, Thickness, or OD",
            "Primary Dim 1 Tolerance",
            "density",
            "lbs./ft. with tolerances",
            "lbs./ft. \r\nw/o tolerances",
            "Cutting $/ Sq. In.",
            "Used for Margin Identifier Excess, TISH 64, TIRD 64, TIPL 64, MM, Other Ti"
        ]);

        const isNumeric = (value) => !isNaN(value) && value.toString().trim() !== "";

        const excelColumns = Object.keys(data[0] || {}).map(normalizeColumnName);
        const missingColumns = columnsToAnalyze.filter(col => !excelColumns.includes(col));
        if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
        }

        let hierarchy = {};
        let pricesArray = [];
        let lengthToleranceData = [];
        let discountedData = [];
        // .filter(item => {
        //     const normalizedRow = {};
        //     // Normalize row keys to match normalized column names
        //     Object.keys(item).forEach((key) => {
        //         normalizedRow[normalizeColumnName(key)] = item[key];
        //     });
        //     if (normalizedRow[discountColumns[1]] === "Excess") {
        //         return item
        //     }
        // })
        const transformedData = data?.map((row, rowIndex) => {
            const normalizedRow = {};
            // Normalize row keys to match normalized column names
            Object.keys(row).forEach((key) => {
                normalizedRow[normalizeColumnName(key)] = row[key];
            });

            const newUniqueID = generateNewUniqueIDExcel(row, rowIndex);

            return {
                alloyFamily: normalizedRow[columnsToAnalyze[0]] || "",
                productForm: normalizedRow[columnsToAnalyze[1]] || "",
                gradeAlloy: normalizedRow[columnsToAnalyze[2]] || "",
                specifications: normalizedRow[columnsToAnalyze[3]] || "",
                primaryDimension: normalizedRow[columnsToAnalyze[4]] || "",

                available_quantity: normalizedRow[optionalColumns[0]] || 0,
                identifier: normalizedRow[optionalColumns[1]] || "",
                uom: normalizedRow[optionalColumns[2]] === 'lbs.' ? 'lb' : normalizedRow[optionalColumns[2]] || "",

                length: normalizedRow[optionalColumns[3]] || "",
                lengthTolerance: normalizedRow[optionalColumns[4]] || "",
                diameter: normalizedRow[optionalColumns[5]] || "",
                primaryDimTol: normalizedRow[optionalColumns[6]] || "",
                density: normalizedRow[optionalColumns[7]] || "",
                lbFTTol: normalizedRow[optionalColumns[8]] || "",
                lbFTwithoutTol: normalizedRow[optionalColumns[9]] || "",
                discountedType: normalizedRow[discountColumns[1]],
                uniqueID: newUniqueID,
            };
        });

        setDiscountedData(transformedData);
        data.forEach((row, rowIndex) => {
            let currentLevel = hierarchy;
            columnsToAnalyze.forEach((col, index) => {
                const matchingKey = Object.keys(row).find(key => normalizeColumnName(key) === col);
                if (!matchingKey) {
                    throw new Error(`Missing field "${col}" in row ${rowIndex + 1}`);
                }

                const trimmedValue = row[matchingKey]?.toString().trim();
                if (!trimmedValue) {
                    throw new Error(`Empty value in field "${col}" at row ${rowIndex + 1}`);
                }

                if (!currentLevel[trimmedValue]) {
                    currentLevel[trimmedValue] = index === columnsToAnalyze.length - 1 ? [] : {};
                }

                if (index === columnsToAnalyze.length - 1) {
                    if (!currentLevel[trimmedValue].includes(trimmedValue)) {
                        currentLevel[trimmedValue].push(trimmedValue);
                    }
                } else {
                    currentLevel = currentLevel[trimmedValue];
                }
            });

            // Generate the new Unique ID based on the fields
            const newUniqueID = generateNewUniqueIDExcel(row, rowIndex);

            // Extract prices from named and numeric columns
            Object.keys(row).forEach((colName) => {
                if (priceColumnPatterns.some((pattern) => pattern.test(colName)) || isNumeric(colName)) {
                    pricesArray.push({
                        uniqueID: newUniqueID,
                        priceLabel: colName,
                        prices: row[colName]?.toString().split(",").map(price => price.trim()) || []
                    });
                }
            });

            // Extract discount data
            Object.keys(row).forEach((colName) => {
                const matchingKey = discountColumns.find(col => col === normalizeColumnName(colName));
                if (matchingKey) {
                    const cellValue = row[colName]?.toString().trim(); // Get the cell value
                    let quantity = null;
                    let identifier = null;

                    // Determine whether the cell contains numeric or text data
                    if (!isNaN(cellValue) && cellValue !== "") {
                        // If the value is numeric, assign to quantity
                        quantity = Number(cellValue);
                    } else {
                        // Otherwise, treat it as an identifier
                        identifier = cellValue;
                    }

                    // Check if an object for the same uniqueID already exists
                    let existingEntry = discountedData.find(entry => entry.uniqueID === newUniqueID);
                    if (existingEntry) {
                        // Update the existing entry with non-null values
                        if (quantity !== null) existingEntry.quantity = quantity;
                        if (identifier !== null) existingEntry.identifier = identifier;
                    } else {
                        // Create a new entry if none exists
                        discountedData.push({
                            uniqueID: newUniqueID,
                            quantity: quantity,
                            identifier: identifier,
                        });
                    }
                }
            });

            Object.keys(row).forEach((colName) => {
                const matchingKey = lengthToleranceColumns.find(col => col === normalizeColumnName(colName));
                if (matchingKey) {
                    lengthToleranceData.push({
                        uniqueID: newUniqueID,
                        toleranceLabel: colName,
                        value: row[colName] || null // Store actual value
                    });
                }
            });
        });
        const prodDiscount = discountedData?.length > 0 ? discountedData?.filter(item => item.identifier === "Excess") : []
        setStructuredData(convertToArray(hierarchy));
        setPricesData(transformPriceData(pricesArray, prodDiscount));
        setToleranceData(transformToleranceData(lengthToleranceData));
    };
    const convertToArray = (hierarchy) => {
        return Object.entries(hierarchy).map(([metal, grades]) => ({
            alloyFamily: metal,
            products: Object.entries(grades).map(([products, grades]) => ({
                product: products,
                grades: Object.entries(grades).map(([grade, specs]) => ({
                    gradeAlloy: grade,
                    specifications: Object.entries(specs).map(([specification, dimension]) => ({
                        specification: specification,
                        primaryDimension: Object.keys(dimension).map((key) => key), // Flatten dimension keys as array of strings
                    })),
                })),
            })),
        }));
    };
    const onSubmit = async (data) => {
        if (!structuredData?.length > 0) {
            toast.error('Please Import Excel File')
            return
        }
        setIsSubmiting(true)
        const nProductData = structuredData?.map((item) => ({ ...item, type: data?.type, productFile: data?.productFile }))
        const nPriceData = pricesData?.map((item) => ({ ...item, type: data?.type, productFile: data?.productFile }))
        const nToleranceData = toleranceData ? toleranceData?.map((item) => ({ ...item, type: data?.type, productFile: data?.productFile })) : []
        const discountedProd = discountedData?.length > 0 ? discountedData?.map((item) => ({ ...item, type: data?.type })) : []
        const nData = {
            products: nProductData,
            pricesData: nPriceData,
            toleranceData: nToleranceData,
            discountedProd
        }
        await post('product/create', nData)
            .then(async (result) => {
                if (result.success) {
                    toast.success(result.message)
                    reset()
                    setIsOpen(false)
                    handleGetProduct()
                    setStructuredData([])
                    await post('file/create', { ...uploadedFileDetail, uploadedType: data?.type })
                        .then((result) => {
                            console.log(result)
                            setUploadedFileDetail(null)
                        }).catch((err) => {
                            console.log(err)
                        });
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => setIsSubmiting(false))
    };
    return (
        <>
            <Dialog open={isOpen} onClose={closeModal}>
                <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                            Import Product
                        </DialogTitle>
                    </DialogHeader>

                    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="type" className="block font-medium text-gray-700">
                                Select Product Type
                            </Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="type"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <SelectOption disabled value="">
                                            Select Product Type
                                        </SelectOption>
                                        <SelectOption value="pipe-fitting">Pipe and Fittings</SelectOption>
                                        <SelectOption value="mill-product">Mill Products</SelectOption>
                                    </Select>
                                )}
                            />
                            {errors.type && <FormFeedback>{errors.type.message}</FormFeedback>}
                        </div>

                        <div>
                            <Button
                                type="button"
                                disabled={isLoading || isSubmiting}
                                className="w-full md:w-auto"
                                onClick={handleButtonClick}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {isLoading ? <Spinner /> : 'Import Products'}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept=".csv,.xlsx"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                            {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                            {file?.length > 0 && productFile && (
                                <div className="">
                                    <Link href={productFile} target="_blank">
                                        <FormFeedback style={{ fontSize: 16 }}>{file[0]?.name}</FormFeedback>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    disabled={isLoading || isSubmiting}
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isLoading || isSubmiting}
                                    type="submit"
                                    variant="primary"
                                >
                                    {isSubmiting ? <Spinner /> : 'Submit'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Button className="w-full md:w-auto" onClick={() => setIsOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import Products
            </Button>
            {/* */}
        </>
    );
};

export default ExcelProcessor;
