'use client'
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import SpinnerOverlay from "@/components/ui/spinnerOverlay";
import { Textarea } from "@/components/ui/textarea";
import ApiFunction from "@/lib/api/apiFuntions";
import { handleError } from "@/lib/api/errorHandler";
import { uploadFile } from "@/lib/api/uploadFile";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.object().required("Category is required"),
    images: yup.array().of(yup.string()).min(1, "At least one image is required"),
    description: yup.string().required("Description is required"),
});

const categoryOptions = [
    { value: "titanium", label: "Titanium" },
    { value: "stainless-steel", label: "Stainless Steel" },
    { value: "nickel-alloy", label: "Nickel Alloy" },
    { value: "alloy-steel", label: "Alloy Steel" },
    { value: "cobalt-chrome-moly", label: "Cobalt Chrome Moly" },
    { value: "carbon-steel", label: "Carbon Steel" },
    { value: "aluminum", label: "Aluminum" },
];

const CategoryCalForm = () => {
    const { get, post } = ApiFunction()
    const [rowData, setRowData] = useState(null);
    const { id } = useParams()
    const { back } = useRouter()
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            images: []
        }
    });

    const images = watch('images')

    const handleGetByID = async (id) => {
        setIsDataLoading(true)
        await get(`category/byId/${id}`)
            .then((result) => {
                if (result) {
                    setRowData(result?.categoryData)
                    handleRowdata(result?.category)
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsDataLoading(false)
            })
    }

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsFileUploading(true);
        
        try {
            const uploadPromises = files.map(file => uploadFile(file, true));
            const results = await Promise.all(uploadPromises);
            
            const currentImages = watch('images') || [];
            const newImages = results.map(result => result?.image).filter(Boolean);
            const updatedImages = [...currentImages, ...newImages];
            
            setValue('images', updatedImages);
            
        } catch (err) {
            handleError(err);
        } finally {
            e.target.value = '';
            setIsFileUploading(false);
        }
    }

    const removeImage = (imageIndex) => {
        const currentImages = watch('images') || [];
        const updatedImages = currentImages.filter((_, index) => index !== imageIndex);
        setValue('images', updatedImages);
    }

    const handleRowdata = (row) => {
        setValue('images', row?.images || [])
        setValue('description', row?.description)
        setValue('name', categoryOptions.find(item => item.label === row?.name))
    }

    useEffect(() => {
        if (id) {
            handleGetByID(id)
        }
    }, [id]);

    const onSubmit = async (data) => {
        const nData = {
            ...data,
            name: data?.name?.label,
        }
        setIsDataLoading(true)
        await post(`category`, nData)
            .then((result) => {
                if (result) {
                    back()
                    toast.success(result?.message)
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                setIsDataLoading(false)
            })
    }

    return (
        <div>
            {isDataLoading && <SpinnerOverlay />}
            <Link href={'/dashboard/category-management'} replace>
                <Button size='sm'> <ArrowLeft size={15} /> </Button>
            </Link>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div>
                    <Label className="mb-2">Select Category</Label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isClearable
                                {...field}
                                options={categoryOptions}
                                placeholder="Select category"
                            />
                        )}
                    />
                    {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </div>

                <div>
                    <Label className="mb-2">Category Images</Label>
                    <Input
                        disabled={isFileUploading}
                        onChange={handleUpload}
                        type="file"
                        accept="image/*"
                        multiple
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        You can select multiple images at once
                    </p>
                </div>

                {isFileUploading && (
                    <div className="flex justify-center py-5">
                        <Spinner />
                        <span className="ml-2 text-sm text-gray-600">Uploading images...</span>
                    </div>
                )}

                {/* Display uploaded images */}
                {images && images.length > 0 && (
                    <div className="mt-4">
                        <Label className="block mb-2">Uploaded Images ({images.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((image, imageIndex) => (
                                <div key={imageIndex} className="relative group">
                                    <img
                                        src={image}
                                        alt={`Category image ${imageIndex + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(imageIndex)}
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Show validation error for images */}
                {errors.images && (
                    <FormFeedback>
                        {errors.images.message}
                    </FormFeedback>
                )}

                <div>
                    <Label className="mb-2">Category Description</Label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <Textarea {...field} placeholder="Enter description" />}
                    />
                    {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CategoryCalForm;