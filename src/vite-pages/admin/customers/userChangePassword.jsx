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
import { Spinner } from '@/components/ui/spinner'
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';

export function UserChangePassword() {
    const rowData = useSelector(state => state.prod.customerData)
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { post, put, get } = ApiFunction()
    const pathname = usePathname()
    const isCreateCustomer = pathname === '/dashboard/customers/add'
    const isDisabled = isCreateCustomer || !rowData
    const schema = z.object({
        password: password ? z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters') : z.string().optional(),
        confirmPassword: password ? z.string({ required_error: 'Confirm Password is required' }) : z.string().optional(),
    }).refine((data) => {
        if (password) {
            return data.password === data.confirmPassword;
        }
        return true;
    }, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const nPassword = watch('password')

    const onSubmit = async (data) => {

        if (rowData) {
            setIsLoading(true);
            await put(`users/update-user/${rowData?._id}`, data)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                });
        }
    };

    useEffect(() => {
        setPassword(nPassword)
    }, [nPassword]);

    return (
        <div className="">
            <div className="w-full space-y-8">

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    disabled={isDisabled}
                                    placeholder="*******"
                                    aria-invalid={!!errors.password}
                                />
                            )}
                        />
                        {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                    </div>

                    {/* Confirm Password */}
                    {
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        disabled={isDisabled}
                                        placeholder="Confirm Password"
                                        aria-invalid={!!errors.confirmPassword}
                                    />
                                )}
                            />
                            {errors.confirmPassword && (
                                <FormFeedback>{errors.confirmPassword.message}</FormFeedback>
                            )}
                        </div>}

                    <div className='flex'>
                        <Button
                            type="submit"
                            className=""
                            size='sm'
                            disabled={isLoading || isDisabled}
                        >
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Change Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}