'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import { useRouter } from 'next/navigation';

export function CompetitorDomainForm({ rowData }) {
    const { back } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { post, put } = ApiFunction()
    const schema = z.object({
        domain: z.string({ required_error: "Domain is required" })
            .regex(/^@[\w-]+\.[a-zA-Z]{2,}$/, { message: "Invalid domain format (e.g., @test.com)" }),
    });
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        const finalData = {
            domain: data.domain,
        };
        if (rowData) {
            await put(`competitor/edit/${rowData?._id}`, finalData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        reset()
                        back()
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(true)
            await post('competitor/create', finalData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        reset()
                        back()
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                })
        }
    };

    const handleSetUserData = (user) => {
        setValue('domain', user?.domain)
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
                        {/* First Name */}
                        <div>
                            <Label htmlFor="domain">Doman Email (ex: @test.com):</Label>
                            <Controller
                                name="domain"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Doman Email (ex: @test.com)"
                                        aria-invalid={!!errors.domain}
                                    />
                                )}
                            />
                            {errors.domain && <FormFeedback>{errors.domain.message}</FormFeedback>}
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
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : rowData ? 'Update Domain' : 'Add Domain'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}