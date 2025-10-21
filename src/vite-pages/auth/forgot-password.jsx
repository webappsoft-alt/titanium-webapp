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
import { handleError } from '@/lib/api/errorHandler';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Invalid email address'),
}).partial();

export function ForgotPassword() {
  const { push } = useRouter();
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
    post('users/forget-password', data)
      .then((result) => {
        if (result.success) {
          toast.success(result.message)
          push('/auth/login')
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Recover Account
          </h2>
          <p className='text-center'>Please enter your email address. You will receive a reset password link.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
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
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Forgot Password...' : 'Forgot Password'}
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
      </div>
    </div>
  );
}