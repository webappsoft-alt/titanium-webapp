'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { CheckBox } from '@/components/ui/checkbox';
import PhoneInput from 'react-phone-number-input'
import { Select, SelectOption } from '@/components/ui/select';
import ApiFunction from '@/lib/api/apiFuntions';
import { setTempUserData } from '@/lib/redux/loginForm';
import { useDispatch, useSelector } from 'react-redux';
import { encryptData } from '@/lib/api/encrypted';
import { handleError } from '@/lib/api/errorHandler';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TermsAndConditions from '@/components/customer/termsAndConditions';
import { X } from 'lucide-react';

// Validation schema
const schema = z
  .object({
    fname: z.string({ required_error: 'First name is required' }),
    company: z.string({ required_error: 'Company name is required' }),
    lname: z.string().min(0),
    address: z.string().min(0),
    country: z.string({ required_error: 'Country is required' }),
    zipCode: z.string().min(0).optional(),
    industry: z.string().min(0),
    city: z.string().min(0),
    state: z.string().min(0),
    isAcceptTerms: z.boolean(),
    isTaxLicense: z.boolean().optional(),
    isAcceptSendOffers: z.boolean().optional(),
    phone: z.string({ required_error: 'Phone Number is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string({ required_error: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
const industry = ["Aerospace", "Defense", "Industrial", "Medical", "Oil / Gas", "Other"]

export function SignUpPage() {
  const countriesList = useSelector(state => state.prod.countriesList) || []
  const statesList = useSelector(state => state.prod.statesList) || []
  const { push } = useRouter();
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const { post } = ApiFunction()
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false)
  }
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      isAcceptTerms: true,
      isAcceptSendOffers: true,
      country: ''
    }
  });
  const country = watch('country')
  const state = watch('state')
  const filterStateList = statesList?.filter(item => item?.country === country) || []

  const onSubmit = async (data) => {
    const { email } = data;
    setIsLoading(true);
    const nData = {
      ...data, email: data?.email?.toLowerCase(),
      old_country_id: countriesList?.find(item => item?._id === country)?.old_id,
      country: countriesList?.find(item => item?._id === country)?.name,
      countryID: countriesList?.find(item => item?._id === country)?._id,

      old_state_id: filterStateList?.find(item => item?._id === state)?.old_id,
      state: filterStateList?.find(item => item?._id === state)?.name,
      stateID: filterStateList?.find(item => item?._id === state)?._id,
    }
    delete nData.confirmPassword;
    await post('users/signup/customer', nData)
      .then((result) => {
        toast.success(result.message)
        const encrpt = encryptData({ email: data?.email })
        dispatch(setTempUserData(encrpt))
        push('/auth/code-verification')
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className=" text-3xl text-center font-bold tracking-tight text-gray-900">
              Apply for a “T.I. Quick Quote App” account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Why should you apply for an account?
            </p>
            <ul className='text-gray-600'>
              <li>-Get approved access within 24 hours</li>
              <li>-Fast & easy check out</li>
              <li>-Easy access to your order history & status</li>
              <li>-Pay by invoice</li>
            </ul>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <div>
              <Label htmlFor="fname">First Name <span className='text-red-600'>*</span> </Label>
              <Controller
                name="fname"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="First Name"
                    aria-invalid={!!errors.fname}
                  />
                )}
              />
              {errors.fname && <FormFeedback>{errors.fname.message}</FormFeedback>}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lname">Last Name</Label>
              <Controller
                name="lname"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Last Name"
                    aria-invalid={!!errors.lname}
                  />
                )}
              />
              {errors.lname && <FormFeedback>{errors.lname.message}</FormFeedback>}
            </div>
            <div>
              <Label htmlFor="company">Company  <span className='text-red-600'>*</span></Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Company"
                    aria-invalid={!!errors.company}
                  />
                )}
              />
              {errors.company && <FormFeedback>{errors.company.message}</FormFeedback>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email  <span className='text-red-600'>*</span></Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Your Email Address"
                    aria-invalid={!!errors.email}
                  />
                )}
              />
              {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="phone">Enter Phone  <span className='text-red-600'>*</span></Label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={field.value}
                    className="phone-input-container relative" // Apply custom input styling
                    onChange={(e) => field.onChange(e)}
                  />
                )}
              />
              {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
            </div>

            <div>
              <Label htmlFor="industry">Industry <span className='text-red-600'>*</span></Label>
              <Controller
                name="industry"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    aria-invalid={!!errors.industry}>
                    <SelectOption disabled value="">
                      Select Industry
                    </SelectOption>
                    {industry.map((item, index) => (
                      <SelectOption key={index} value={item}>
                        {item}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              />

              {errors.industry && <FormFeedback>{errors.industry.message}</FormFeedback>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="address"
                    aria-invalid={!!errors.address}
                  />
                )}
              />
              {errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
            </div>
            <div className='grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1'>
              <div>
                <Label htmlFor="country">Country  <span className='text-red-600'>*</span></Label>
                <Controller
                  name="country"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <Select
                      {...field}
                      required
                      aria-invalid={!!errors.country}
                    >
                      <SelectOption disabled value="">
                        Select Country
                      </SelectOption>
                      {countriesList?.map((item, index) => (
                        <SelectOption key={index} value={item?._id}>
                          {item?.name}
                        </SelectOption>
                      ))}
                    </Select>
                  )}
                />

                {errors.country && <FormFeedback>{errors.country.message}</FormFeedback>}
              </div>
              <div>
                <Label htmlFor="city">City <span className='text-red-600'>*</span></Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="city"
                      aria-invalid={!!errors.city}
                    />
                  )}
                />
                {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code </Label>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="zipCode"
                      aria-invalid={!!errors.zipCode}
                    />
                  )}
                />
                {errors.zipCode && <FormFeedback>{errors.zipCode.message}</FormFeedback>}
              </div>
              <div>
                <Label htmlFor="state">State <span className='text-red-600'>*</span></Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={!country}
                      aria-invalid={!!errors.state}
                    >
                      <SelectOption disabled value="">
                        Select State
                      </SelectOption>
                      {filterStateList?.map((item, index) => (
                        <SelectOption key={index} value={item?._id}>
                          {item?.name}
                        </SelectOption>
                      ))}
                    </Select>
                  )}
                />
                {/* {!country && <FormFeedback>Please Select Country</FormFeedback>} */}
                {errors.state && <FormFeedback>{errors.state.message}</FormFeedback>}
              </div>
            </div>
            {/* Password */}
            <div>
              <Label htmlFor="password">Password  <span className='text-red-600'>*</span></Label>
              <Controller
                name="password"
                control={control}
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

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password  <span className='text-red-600'>*</span></Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm Password"
                    aria-invalid={!!errors.confirmPassword}
                  />
                )}
              />
              {errors.confirmPassword && (
                <FormFeedback>{errors.confirmPassword.message}</FormFeedback>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex">
              <Controller
                name="isAcceptTerms"
                control={control}
                rules={{ required: 'You must accept the terms and conditions' }}
                render={({ field }) => (
                  <CheckBox
                    {...field}
                    aria-invalid={!!errors.isAcceptTerms}
                    className="mr-2"
                    checked={field.value} // Make sure the checkbox is linked to field.value
                    onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                  />
                )}
              />
              <Label htmlFor="isAcceptTerms">
                By signing up, you are agreeing to our{' '}
                <Link href="" onClick={() => setIsOpen(true)} className="text-danger">
                  Terms & Conditions
                </Link>
              </Label>
            </div>
            <div className="flex">
              <Controller
                name="isAcceptSendOffers"
                control={control}
                render={({ field }) => (
                  <CheckBox
                    {...field}
                    aria-invalid={!!errors.isAcceptSendOffers}
                    className="mr-2"
                    checked={field.value} // Make sure the checkbox is linked to field.value
                    onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                  />
                )}
              />
              <Label htmlFor="isAcceptSendOffers">Send me email specials and other Exclusive Offers</Label>
            </div>
            <div className="pb-3 flex">
              <Controller
                name="isTaxLicense"
                control={control}
                render={({ field }) => (
                  <CheckBox
                    {...field}
                    aria-invalid={!!errors.isTaxLicense}
                    className="mr-2"
                    checked={field.value} // Make sure the checkbox is linked to field.value
                    onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                  />
                )}
              />
              <Label htmlFor="isTaxLicense">
                Do you have a State Tax Exempt License?
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Sign up'}
            </Button>
            <div
              className=""
              style={{ fontWeight: 400, fontSize: "14px" }}
            >
              Already have an account?{" "}
              <Link
                href={"/auth/login"}
                className="text-danger"
                style={{ fontWeight: 500, fontSize: "14px" }}
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogContent className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl" onClose={onClose}>
          <DialogHeader className=" mb-6">
            <DialogTitle> Terms and Conditions</DialogTitle>
            
          </DialogHeader>
          <div className='max-h-[80vh] overflow-auto'>
            <TermsAndConditions />
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
