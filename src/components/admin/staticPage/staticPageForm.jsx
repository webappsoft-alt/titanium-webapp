'use client'
/* eslint-disable no-unused-vars */
import React, { Suspense, useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import toast from "react-hot-toast"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import ApiFunction from "@/lib/api/apiFuntions"
import { handleError } from "@/lib/api/errorHandler"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FormFeedback } from "@/components/ui/formFeedBack"
import SpinnerOverlay from "@/components/ui/spinnerOverlay"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Loading from "@/app/loading"

// Define the Yup validation schema
const pageContentArray = [
    { value: 'terms-condition', label: 'Terms & Condition' },
    { value: 'faqs', label: 'FAQs Content' },
]
const schema = (type) => (Yup.object().shape({
    type: Yup.string().required("Type is required"),
    question: type !== 'faqs' ? Yup.string() : Yup.string().required("Question is required"),
    answer: type !== 'faqs' ? Yup.string() : Yup.string().required("Answer is required"),
    detail: type !== 'terms-condition' ? Yup.string() : Yup.string().required("Detail is required")
}))

const StaticForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const { back } = useRouter()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const query = params.get('query') || ''
    const [rowData, setRowData] = useState(null)
    const selectType = pageContentArray?.find(item => pathname.endsWith(item.value)) || ''
    const { put, post, get } = ApiFunction()
    const {
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema(selectType?.value)) })
    const detail = watch('detail')
    const question = watch('question')
    const answer = watch('answer')

    const handleCKEditor = (event, editor) => {
        const data = editor.getData()
        setValue('detail', data)
    }

    const handleAnswerCKEditor = (event, editor) => {
        const data = editor.getData()
        setValue('answer', data)
    }

    const handleGetByID = async (id) => {
        setIsLoading(true)
        await get(`static-pages/byId/${id}`)
            .then((result) => {
                if (result.success) {
                    setRowData(result?.staticPage)
                    setValue('detail', result?.staticPage?.detail || "")
                    setValue('question', result?.staticPage?.faqs?.question || "")
                    setValue('answer', result?.staticPage?.faqs?.answer || "")
                }
                setIsLoading(false)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        setValue('type', selectType?.value)
        if (query) {
            handleGetByID(query)
        }
    }, [query])

    const onSubmit = async (data) => {
        setIsLoading(true)
        const endpoint = rowData ? `static-pages/edit/${rowData?._id}` : 'static-pages/create'
        const method = rowData ? put : post
        const nData = {
            ...data,
            faqs: { question: data?.question, answer: data?.answer }
        }
        await method(endpoint, nData)
            .then((result) => {
                if (result.success) {
                    reset()
                    toast.success(result.message)
                    back()
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            {isLoading && <SpinnerOverlay />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-3">
                    {selectType?.value === 'faqs' ? (
                        <>
                            <div className="col-md-12 pb-3">
                                <Label>Question</Label>
                                <Controller
                                    name="question"
                                    control={control}
                                    render={({ field }) => <Input placeholder="Enter Question" className="form-control" {...field} />}
                                />
                                {errors.question && <FormFeedback>{errors.question.message}</FormFeedback>}
                            </div>
                            <div className="col-md-12 pb-3">
                                <Label>Answer</Label>
                                {/* <Controller
                                    name="answer"
                                    control={control}
                                    render={({ field }) => <Textarea placeholder="Enter Answer" className="form-control" {...field} />}
                                />
                                {errors.answer && <FormFeedback>{errors.answer.message}</FormFeedback>} */}
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={answer || ""}
                                    config={{
                                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'mediaEmbed', '|', 'undo', 'redo']
                                    }}
                                    onChange={handleAnswerCKEditor}
                                />
                                {errors.answer && <FormFeedback>{errors.answer.message}</FormFeedback>}
                            </div>
                        </>
                    ) : (
                        <div className="col-md-12">
                            <CKEditor
                                editor={ClassicEditor}
                                data={detail || ""}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'mediaEmbed', '|', 'undo', 'redo']
                                }}
                                onChange={handleCKEditor}
                            />
                            {errors.detail && <FormFeedback>{errors.detail.message}</FormFeedback>}
                        </div>
                    )}
                </div>
                <Button type="submit" disabled={isLoading} className="mt-2 text-center" color="primary">
                    {isLoading ? <Spinner size={'sm'} /> : (rowData ? "Update" : "Submit")}
                </Button>
            </form>
        </>
    )
}

const StaticPageForm = () => {
    return (
        <>
            <Suspense fallback={<Loading />} >
                <StaticForm />
            </Suspense>
        </>
    )
}

export default StaticPageForm