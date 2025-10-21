'use client'
import React, { Fragment, useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { handleError } from "../api/errorHandler";
import ApiFunction from "../api/apiFuntions";
import { uploadDoc, uploadFile } from "../api/uploadFile";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from "@/components/ui/dialog";

const schema = z.object({
    file: z.any().refine((file) => file.length > 0, "File is required"),
});

const ImportProductData = ({ handleGetProduct }) => {
    const [structuredData, setStructuredData] = useState([]);
    const [pricesData, setPricesData] = useState([]);
    const [toleranceData, setToleranceData] = useState([]);
    const fileInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFileLoading, setIsFileLoading] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const { post, get } = ApiFunction()
    const [uploadedFileDetail, setUploadedFileDetail] = useState(null);

    function closeModal() {
        setIsOpen(false)
    }
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
    const file = watch('file')
    const productFile = watch('productFile')
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setValue("file", [e.target.files[0]]);
        setIsLoading(true); // Start loading
        try {
            const fileExtension = file.name.split(".").pop().toLowerCase();

            if (fileExtension === "csv") {
                processCSV(file);
            } else if (fileExtension === "xlsx") {
                processXLSX(file);
            } else {
                e.target.value = '';
                setValue("file", null);
                throw ({ message: "Unsupported file format. Please upload CSV or XLSX." });
            }
            await uploadDoc(file)
                .then((result) => {
                    setValue('productFile', result.doc)
                    const fileInfo = {
                        name: file.name,
                        size: file.size,
                        type: fileExtension,
                        url: result.doc,
                    };
                    setUploadedFileDetail(fileInfo);
                }).catch((err) => {
                    console.log(err)
                });
        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false); // Stop loading on error
        }
    };

    const processCSV = (file) => {
        Papa.parse(file, {
            header: true,
            complete: async (result) => {
                try {
                    validateAndTransformData(result.data);
                } catch (error) {
                    throw new Error(error.message);
                }
            },
            skipEmptyLines: true,
        });
    };
    const processXLSX = async (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            try {
                validateAndTransformData(jsonData);
            } catch (error) {
                throw new Error(error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };
    const normalizeColumnName = (name) => {
        const value = name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ") // Normalize multiple spaces to a single space
            .replace(/[\r\n]+/g, ""); // Remove line breaks}
        return value
    }

    // Function to download the image and convert it to a Blob
    const downloadImage = async (url) => {
        try {
            const response = await axios.get(url, { responseType: "blob" });
            return response.data;
        } catch (err) {
            console.log(err)
            throw err;
        }
    };
    // Function to handle the entire process
    const handleDownloadAndUpload = async (imageUrl) => {
        try {
            if (!imageUrl) {
                return ""
            }
            const imageBlob = await downloadImage(imageUrl);
            const result = await uploadFile(imageBlob)
            return result?.image
        } catch (err) {
            console.error("Error during process:", err);
        }
    };
    const validateAndTransformData = async (data) => {
        let transformedData = [];
        setIsFileLoading(true); // Start loading

        // Create an array of promises to handle asynchronous image downloads
        const promises = data.map(async (row) => {
            const image = await handleDownloadAndUpload(row["Image url"] || "");

            if (row["description"]) {
                let structuredItem = {
                    name: row["name"] || "",
                    description: row["description"] || "",
                    image: image || null, // Use null if image is unavailable
                    meta: {
                        title: row["meta_title"] || "",
                        description: row["meta_description"] || "",
                        keywords: row["meta_keywords"] || ""
                    }
                };

                // Push the structured item into the transformed data array
                transformedData.push(structuredItem);
            }
        });

        // Wait for all promises to complete
        await Promise.all(promises);

        // Once all image processing is done, update the structured data
        setIsFileLoading(false); // Stop loading
        setStructuredData(transformedData);
    };
    const onSubmit = async (data) => {
        if (!structuredData?.length > 0) {
            toast.error('Please Import Excel File')
            return
        }
        setIsSubmiting(true)
        await post('prod-data/create', { productDataArray: structuredData })
            .then(async (result) => {
                if (result.success) {
                    toast.success(result.message)
                    reset()
                    setIsOpen(false)
                    handleGetProduct()
                    setStructuredData([])
                    await post('file/create', { ...uploadedFileDetail, uploadedType: '' })
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
                <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl" closeButton={true} onClose={closeModal}>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                            Import Product
                        </DialogTitle>
                    </DialogHeader>

                    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="">
                            <Button
                                type="button"
                                disabled={isLoading || isFileLoading || isSubmiting}
                                className="w-full md:w-auto"
                                onClick={handleButtonClick}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {(isLoading || isFileLoading) ? <Spinner /> : 'Import Products Data File'}
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
                                    disabled={isLoading || isSubmiting || isFileLoading}
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isLoading || isSubmiting || isFileLoading}
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
            <Button className="w-full md:w-auto" variant="outline" onClick={() => setIsOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import Products Data
            </Button>
            {/* */}
        </>
    );
};

export default ImportProductData;
