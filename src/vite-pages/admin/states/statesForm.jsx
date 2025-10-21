'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import ApiFunction from '@/lib/api/apiFuntions';
import { usStates } from '@/components/layout/us-states';
import { countries } from '@/data/countries';
import { handleError } from '@/lib/api/errorHandler';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function StatesForm({ rowData }) {
    const {push, replace, back} = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isStates, setIsStates] = useState(false);
    const [isCountries, setIsCountries] = useState(false);
    const { post, put } = ApiFunction()
    const schema = z.object({
        code: z.string({ required_error: 'Code is required' }),
        location: z.string({ required_error: 'Location is required' }),
    })
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
            code: '',
            location: '',
            states: [],
            countries: []
        }
    });
    const selectedStates = watch('states')
    const selectedCountries = watch('countries')
    const onSubmit = async (data) => {
        const finalData = {
            code: data.code,
            location: data.location,
            states: selectedStates?.length > 0 ? selectedStates
                .map(item => usStates.find(innerItem => innerItem.code === item))
                .filter(Boolean) : [], // Remove undefined values
            countries: selectedCountries.length > 0 ? selectedCountries
                .map(item => countries.find(innerItem => innerItem.code === item))
                .filter(Boolean) : [], // Remove undefined values
        };
        if (rowData) {
            await put(`countries/edit/${rowData?._id}`, finalData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        reset()
                        back()
                        setValue('countries', [])
                        setValue('states', [])
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(true)
            await post('countries/create', finalData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        reset()
                        back()
                        setValue('countries', [])
                        setValue('states', [])
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                })
        }
    };

    const handleSetUserData = (data) => {
        setValue('code', data?.code)
        setValue('location', data?.location)
        setValue('states', data?.states?.length > 0 ? data?.states?.map(item => item?.code) : [])
        setValue('countries', data?.countries?.length > 0 ? data?.countries?.map(item => item?.code) : [])
        if(data?.states?.length > 0) setIsStates(true)
        if(data?.countries?.length > 0) setIsCountries(true)
    }
    useEffect(() => {
        if (rowData) {
            handleSetUserData(rowData)
        }
    }, [rowData]);
    return (
        <div className="flex items-center justify-center">
            <div className="w-full space-y-8">

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1'>
                        <div>
                            <Label htmlFor="code">Code:</Label>
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Code"
                                        aria-invalid={!!errors.code}
                                    />
                                )}
                            />
                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="location">Location:</Label>
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Location"
                                        aria-invalid={!!errors.location}
                                    />
                                )}
                            />
                            {errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex'>
                        <Button
                            type="submit"
                            className=""
                            size='sm'
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : rowData ? 'Update Territories' : 'Add Territories'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}