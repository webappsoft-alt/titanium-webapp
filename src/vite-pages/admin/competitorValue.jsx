'use client'
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ApiFunction from "@/lib/api/apiFuntions";
import SpinnerOverlay from "@/components/ui/spinnerOverlay";
import toast from "react-hot-toast";
import { handleError } from "@/lib/api/errorHandler";
import { Edit2 } from "lucide-react";

const schema = yup.object().shape({
    minValue: yup
        .number()
        .typeError("Min Value must be a number")
        .required("Min Value is required")
        .test("is-less-than-max", "Min Value must be less than Max Value", function (value) {
            return value < this.parent.maxValue;
        }),

    maxValue: yup
        .number()
        .typeError("Max Value must be a number")
        .required("Max Value is required")
        .test("is-greater-than-min", "Max Value must be greater than Min Value", function (value) {
            return value > this.parent.minValue;
        }),
});

const CompetitorMarkup = () => {
    const { get, post } = ApiFunction()
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const handleGet = async () => {
        setIsLoading(true)
        await get('compet-value/admin')
            .then((result) => {
                if (result?.success) {
                    setValue('maxValue', result?.data?.maxValue)
                    setValue('minValue', result?.data?.minValue)
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        handleGet()
    }, []);
    const onSubmit = async (data) => {
        setIsLoading(true)
        await post(`compet-value/create`, data)
            .then((result) => {
                if (result?.success) {
                    setIsEdit(false)
                    toast.success(result?.message)
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                setIsLoading(false)
            })
    };

    return (
        <div className="space-y-6">
            {isLoading && <SpinnerOverlay />}
            <div>
                <h1 className="text-2xl font-bold">Competitor Markup Value Management</h1>
                <p className="text-gray-600">View and manage Competitor Markup Value information</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} >
                <div>
                    <Label>Min Value</Label>
                    <Controller
                        name="minValue"
                        control={control}
                        render={({ field }) => <Input disabled={!isEdit} placeholder="Min Value" type="number" {...field} />}
                    />
                    {errors.minValue && <p style={{ color: "red" }}>{errors.minValue.message}</p>}
                </div>

                <div>
                    <Label>Max Value</Label>
                    <Controller
                        name="maxValue"
                        control={control}
                        render={({ field }) => <Input disabled={!isEdit} placeholder="Max Value" type="number" {...field} />}
                    />
                    {errors.maxValue && <p style={{ color: "red" }}>{errors.maxValue.message}</p>}
                </div>
                {isEdit && <Button type="submit">Submit</Button>}
            </form>
            {!isEdit && <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setIsEdit(true)}> <Edit2 size={15}  className="me-2"/> Edit Value </Button>}
        </div>
    );
};

export default CompetitorMarkup;
