'use client'
import React, { useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle
} from '@/components/ui/dialog'; // Update this path to where you've placed the Dialog component
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { handleError } from "../api/errorHandler";
import ApiFunction from "../api/apiFuntions";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
    file: z.any().refine((file) => file.length > 0, "File is required"),
});

const ImportStatesExcel = ({ handleStates }) => {
    const [structuredData, setStructuredData] = useState([]);
    const fileInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const { post, get } = ApiFunction()

    function closeModal() {
        setIsOpen(false)
    }

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const {
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
        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false); // Stop loading on error
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
                throw new Error(error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const validateAndTransformData = (data) => {
        let transformedData = [];
        data.forEach((row) => {
            let structuredItem = {
                old_id: row?.id,
                old_country_id: row?.country_id,
                abbr: row?.abbr,
                name: row?.name,
            };

            transformedData.push(structuredItem);
        });
        setStructuredData(transformedData);
    };

    const onSubmit = async (data) => {
        if (!structuredData?.length > 0) {
            toast.error('Please Import Excel File')
            return
        }
        setIsSubmiting(true)
        await post('states/create', { states: structuredData })
            .then((result) => {
                if (result.success) {
                    toast.success(result.message)
                    reset()
                    setIsOpen(false)
                    handleStates()
                    setStructuredData([])
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
                            Import States
                        </DialogTitle>
                    </DialogHeader>

                    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="">
                            <Button
                                type="button"
                                disabled={isLoading || isSubmiting}
                                className="w-full md:w-auto"
                                onClick={handleButtonClick}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {isLoading ? <Spinner /> : 'Import States Data File'}
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

            <Button className="w-full md:w-auto" variant="primary" onClick={() => setIsOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import States
            </Button>
        </>
    );
};

export default ImportStatesExcel;