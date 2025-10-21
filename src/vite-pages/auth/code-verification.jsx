'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Countdown from 'react-countdown';
import { FormFeedback } from '@/components/ui/formFeedBack';
import ApiFunction from '@/lib/api/apiFuntions';
import { useDispatch, useSelector } from 'react-redux';
import { decryptData } from '@/lib/api/encrypted';
import { handleLogin, setLogin, setTempUserData, setToken } from '@/lib/redux/loginForm';
import { handleError } from '@/lib/api/errorHandler';
import { useRouter } from 'next/navigation';

const schema = z.object({
  code: z
    .string()
    .length(5, 'Code must be exactly 5 characters'),
}).partial();

export function CodeVerification() {
  const { push, replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false)
  const [seconds, setSeconds] = useState(1);
  const { post } = ApiFunction()
  const tempUserData = useSelector((state) => state.auth.tempUserData)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const resendCode = async () => {
    const userData = tempUserData ? decryptData(tempUserData) : null
    const { email } = userData;
    setIsLoading(true);

    await post('users/send-code', { email })
      .then((result) => {
        toast.success(result.message)
        setSeconds(1)
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsLoading(false)
      });
  }
  const onSubmit = async (data) => {
    setIsLoading(true);
    const userData = tempUserData ? decryptData(tempUserData) : null
    post('users/verify-otp/registration', { email: userData.email, code: data.code })
      .then((result) => {
        if (result.success) {
          toast.success(result.message)
          replace('/auth/login')
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsLoading(false)
      });
  };
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render something when the countdown is complete
      return <span>Countdown complete!</span>;
    } else {

      return <span>{`${minutes}:${seconds} second`}</span>;
    }
  };
  return (
    <div className="flex min-h-[calc(100vh - 4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Code in Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We have forwarded a code to your email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">

            <div className="">
              <Label>Enter code</Label>
              <Controller
                name="code"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter code"
                    aria-invalid={!!errors.code}
                  />
                )}
              />
              {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
            </div>

          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Verify Otp...' : 'Verify Otp'}
          </Button>
          <div className=" pt-2 text-muted" style={{ fontSize: "14px" }}>
            Did you not receive the code? {" "}

            {seconds === 0 ?
              <button type='button' disabled={isProcessing || isLoading} className="text-danger border-0" style={{ fontSize: "14px", backgroundColor: 'transparent' }} onClick={resendCode}>
                {isProcessing ? <Spinner size="sm" className="mx-auto" /> : 'Resend code'}
              </button> :
              <Countdown
                renderer={renderer}
                onComplete={() => setSeconds(0)}
                date={Date.now() + 90000}
              />}
          </div>
        </form>
      </div>
    </div>
  );
}