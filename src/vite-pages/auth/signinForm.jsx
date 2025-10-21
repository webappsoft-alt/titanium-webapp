'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormFeedback } from '@/components/ui/formFeedBack';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleLogin, setLogin, setTempUserData, setToken } from '@/lib/redux/loginForm';
import { handleError } from '@/lib/api/errorHandler';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
}).partial();

export function SigninForm({ isModal = false }) {
    const { push, replace } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { post } = ApiFunction()
    const dispatch = useDispatch()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        await post('auth', data)
            .then(async (result) => {
                if (result.success) {
                    toast.success('Login Successfully')
                    dispatch(setTempUserData(null))
                    dispatch(handleLogin(result.user))
                    dispatch(setToken(result.token))
                    dispatch(setLogin(true))
                    if (result.user?.type === 'admin' || result.user?.type === 'sub-admin') {
                        replace('/dashboard/overview')
                    } else if (!isModal)
                        replace('/')

                    await fetch("/api/set-cookie", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: "user",
                            value: result?.user?.type,
                        }),
                    }).then((result) => {
                        if (result.ok) {
                            window.location.reload()
                        }
                    }).catch((err) => {

                    });
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                setIsLoading(false)
            });
    };

    return (
        <form className="mt-8 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">

                <div className="">
                    <Label>Email address</Label>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="email"
                                placeholder="Your Email Address"
                                aria-invalid={!!errors.email}
                            />
                        )}
                    />
                    {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                </div>
                <div className="">
                    <Label>Password</Label>
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="password"
                                placeholder="*******"
                                aria-invalid={!!errors.password}
                            />
                        )}
                    />
                    {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                </div>
            </div>
            <div className='text-end pb-4'>
                <Link className='link text-danger underline' href={'/auth/forgot-password'}>Forgot Password </Link>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div
                className=""
                style={{ fontWeight: 400, fontSize: "14px" }}
            >
                Don't have an account?{" "}
                <Link
                    href={"/auth/register"}
                    className="text-danger"
                    style={{ fontWeight: 500, fontSize: "14px" }}
                >
                    Sign up
                </Link>
            </div>
        </form>
    );
}