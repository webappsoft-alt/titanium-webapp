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
import { Select, SelectOption } from '@/components/ui/select';
import ApiFunction from '@/lib/api/apiFuntions';
import { useDispatch, useSelector } from 'react-redux';
import { handleError } from '@/lib/api/errorHandler';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Validation schema
const schema = z
  .object({
    country: z.string({ required_error: 'Country is required' }),
    state: z.string().min(0),
  })


export function CheckRouting() {
  const countriesList = useSelector(state => state.prod.countriesList) || []
  const statesList = useSelector(state => state.prod.statesList) || []
  const [isLoading, setIsLoading] = useState(false);
  const { post } = ApiFunction()
  const [isOpen, setIsOpen] = useState(false);
  const [routingData, setRoutingData] = useState(null);
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      country: ''
    }
  });
  const country = watch('country')
  const state = watch('state')
  const filterStateList = statesList?.filter(item => item?.country === country) || []

  const onSubmit = async () => {
    setIsLoading(true);
    const nData = {
      old_country_id: countriesList?.find(item => item?._id === country)?.old_id,
      country: countriesList?.find(item => item?._id === country)?.name,
      countryID: countriesList?.find(item => item?._id === country)?._id,

      old_state_id: filterStateList?.find(item => item?._id === state)?.old_id,
      state: filterStateList?.find(item => item?._id === state)?.name,
      stateID: filterStateList?.find(item => item?._id === state)?._id,
    }
    await post('users/check-routing', nData)
      .then((result) => {
        setRoutingData(result?.data)
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <>
      <div className="">
        <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Test Assign Branch & Email Routing</h1>
          <p className="text-gray-600">View and test assign branch & email routing</p>
        </div>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}

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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Check'}
            </Button>

          </form>
          {routingData && (
            <div className="space-y-6 rounded-xl border p-5 bg-white shadow-sm">

              {/* Branch Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Branch
                </h4>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium text-gray-900">Code:</span>{" "}
                    {routingData?.territoriesData?.code || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Location:</span>{" "}
                    {routingData?.territoriesData?.location || "N/A"}
                  </p>
                </div>
              </div>

              {/* Titanium Users Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Titanium Users Email
                </h4>

                {routingData?.titaniumUsers?.length > 0 ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    {routingData.titaniumUsers.map((email, index) => (
                      <p key={index} className="break-all">
                        {email}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No titanium users found</p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

    </>
  );
}
