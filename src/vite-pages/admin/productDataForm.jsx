'use client'
import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFeedback } from "@/components/ui/formFeedBack";
import { Button } from "@/components/ui/button";
import ApiFunction from "@/lib/api/apiFuntions";
import { ArrowLeft } from "lucide-react";
import SpinnerOverlay from "@/components/ui/spinnerOverlay";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { handleError } from "@/lib/api/errorHandler";
import { CheckBox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { uploadFile } from "@/lib/api/uploadFile";
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor),
  { ssr: false }
);

const ClassicEditor = dynamic(
  () => import("@ckeditor/ckeditor5-build-classic"),
  { ssr: false }
);


const schema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    type: yup.object().required("Product type is required"),
    alloyFamily: yup.object().required("Alloy family is required"),
    alloyType: yup.object().required("Alloy type is required"),
    description: yup.string().required("Description is required"),
    isFeature: yup.boolean().optional(),
    imgAlt: yup.string().optional(),
    meta: yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        keywords: yup.string().required("Keywords are required"),
    }),
    slug: yup.string().required("Slug is required"),
    image: yup.mixed().nullable(),
});
const typeOptions = [
    { value: "pipe-fitting", label: "Pipe and Fittings" },
    { value: "mill-product", label: "Mill Products" },
];

const ProductDataForm = () => {
    const { get, put } = ApiFunction()
    const state = null
    const [rowData, setRowData] = useState(null);
    const { id } = useParams()
    const { back } = useRouter()
    const [alloyFamilyData, setAlloyFamilyData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [alloyTypeData, setAlloyTypeData] = useState([]);
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            isFeature: false
        }
    });
    const type = watch('type')
    const description = watch('description')
    const alloyFamily = watch('alloyFamily')
    const alloyType = watch('alloyType')
    const image = watch('image')
    const handleAnswerCKEditor = (event, editor) => {
        const data = editor.getData()
        setValue('description', data)
    }
    const handleGet = useCallback(async (data, setData) => {
        setIsLoading(true)
        await get('discounted-prod/data', data)
            .then((result) => {
                setData(result?.data)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }, [type])
    const handleGetByID = async (id) => {
        setIsDataLoading(true)
        await get(`prod-data/byId/${id}`)
            .then((result) => {
                if (result?.success) {
                    setRowData(result?.productData)
                    handleRowdata(result?.productData)
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsDataLoading(false)
            })
    }

    const handleSlugChange = (e) => {
        const formattedSlug = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-") // Replace all invalid characters with '-'
            .replace(/-+/g, "-"); // Remove multiple dashes
        setValue("slug", formattedSlug, { shouldValidate: true });
    };
    const handleUpload = async (e) => {
        const file = e.target.files[0]
        setIsFileUploading(true)
        await uploadFile(file, true)
            .then((result) => {
                setValue('image', result?.image)
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                e.target.value = ''
                setIsFileUploading(false)
            })
    }
    const handleRowdata = (row) => {
        setValue('image', row?.image)
        setValue('slug', row?.slug)
        setValue('meta', row?.meta)
        setValue('imgAlt', row?.imgAlt)
        setValue('description', row?.description)
        setValue('alloyType', { label: row?.alloyType, value: row?.alloyType })
        setValue('alloyFamily', { label: row?.alloyFamily, value: row?.alloyFamily })
        setValue('name', row?.name)
        setValue('isFeature', row?.isFeature)
        setValue('type', typeOptions.find(item => item.value === row?.type))

        const data2 = { type: row?.type, distinctValue: 'alloyFamily' }
        handleGet(data2, setAlloyFamilyData)

        const data = { type: row?.type, label: 'alloyFamily', value: row?.alloyFamily, distinctValue: 'productForm' }
        handleGet(data, setAlloyTypeData)
    }
    useEffect(() => {
        if (state) {
            setRowData(state)
            handleRowdata(state)
        } else {
            handleGetByID(id)
        }
    }, [state]);
    const onSubmit = async (data) => {
        const nData = { ...data, type: data?.type?.value, alloyType: data?.alloyType?.value, alloyFamily: data?.alloyFamily?.value, }
        setIsDataLoading(true)
        await put(`prod-data/edit/${rowData?._id}`, nData)
            .then((result) => {
                if (result?.success) {
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
            <Link href={'/dashboard/products'} replace> <Button size='sm'> <ArrowLeft size={15} /> </Button></Link>
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Product Edit / {rowData?.name} </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="mb-2">Product Name</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter product name"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleSlugChange(e);
                                    }}
                                />
                            )}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </div>

                    <div>
                        <Label className="mb-2">Slug</Label>
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Auto-generated slug" onChange={handleSlugChange} />
                            )}
                        />
                        {errors.slug && <FormFeedback>{errors.slug.message}</FormFeedback>}
                    </div>

                    <div>
                        <Label className="mb-2">Type</Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select isClearable {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setValue('alloyFamily', null)
                                        setValue('alloyType', null)

                                        const data = { type: e?.value, distinctValue: 'alloyFamily' }
                                        handleGet(data, setAlloyFamilyData)

                                    }} options={typeOptions} placeholder="Select product type" />
                            )}
                        />
                        {errors.type && <FormFeedback>{errors.type.message}</FormFeedback>}
                    </div>

                    <div>
                        <Label className="mb-2">Alloy Family</Label>
                        <Controller
                            name="alloyFamily"
                            control={control}
                            render={({ field }) => (
                                <Select isClearable {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setValue('alloyType', null)

                                        const data = { type: type?.value, label: 'alloyFamily', value: e?.value, distinctValue: 'productForm' }
                                        handleGet(data, setAlloyTypeData)

                                    }} isLoading={isLoading} options={alloyFamilyData?.map((item => ({ label: item, value: item })))} placeholder="Select alloy family" />
                            )}
                        />
                        {errors.alloyFamily && <FormFeedback>{errors.alloyFamily.message}</FormFeedback>}
                    </div>

                    <div>
                        <Label className="mb-2">Product Form</Label>
                        <Controller
                            name="alloyType"
                            control={control}
                            render={({ field }) => (
                                <Select isClearable {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                    }} isLoading={isLoading} options={!alloyFamily ? [] : alloyTypeData?.map((item => ({ label: item, value: item })))} placeholder="Select alloy type" />
                            )}
                        />
                        {errors.alloyType && <FormFeedback>{errors.alloyType.message}</FormFeedback>}
                    </div>
                    <div>
                        <Label className="mb-2">Meta Title</Label>
                        <Controller
                            name="meta.title"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Enter meta title" />}
                        />
                        {errors.meta?.title && <FormFeedback>{errors.meta.title.message}</FormFeedback>}
                    </div>
                </div>
                <div>
                    <Label className="mb-2">Meta Keywords</Label>
                    <Controller
                        name="meta.keywords"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Enter meta keywords (comma separated)" />}
                    />
                    {errors.meta?.keywords && <FormFeedback>{errors.meta.keywords.message}</FormFeedback>}
                </div>
                <div>
                    <Label className="mb-2">Meta Description</Label>
                    <Controller
                        name="meta.description"
                        control={control}
                        render={({ field }) => <Textarea {...field} placeholder="Enter meta description" />}
                    />
                    {errors.meta?.description && <FormFeedback>{errors.meta.description.message}</FormFeedback>}
                </div>
                <div className="flex">
                    <Controller
                        name="isFeature"
                        control={control}
                        rules={{ required: 'You must accept the terms and conditions' }}
                        render={({ field }) => (
                            <CheckBox
                                {...field}
                                aria-invalid={!!errors.isFeature}
                                className="mr-2"
                                checked={field.value} // Make sure the checkbox is linked to field.value
                                onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                            />
                        )}
                    />
                    <Label htmlFor="isFeature">
                        Is Featured Product?
                    </Label>
                </div>
                <div>
                    <Label className="mb-2">Product Image</Label>
                    <Input disabled={isFileUploading} onChange={handleUpload} type="file" accept="image/*" />
                </div>
                <div>
                    <Label className="mb-2">Image Alt </Label>
                    <Controller
                        name="imgAlt"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Enter Image Alternative Name" />}
                    />
                </div>
                {isFileUploading ? <div className="flex justify-center py-5" > <Spinner /> </div> :
                    (image) && <img src={image} alt="" className="object-contain" />
                }
                <div>
                    <Label className="mb-2">Product Description</Label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={description || ""}
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'mediaEmbed', '|', 'undo', 'redo']
                        }}
                        onChange={handleAnswerCKEditor}
                    />
                    {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default ProductDataForm;
