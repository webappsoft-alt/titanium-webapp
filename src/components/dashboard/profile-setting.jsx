'use client'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { CheckBox } from '@/components/ui/checkbox';
import { Select, SelectOption } from '@/components/ui/select';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import { UserAddresses } from '@/vite-pages/admin/customers/userAddresses';
import { setCustomerData } from '@/lib/redux/products';
import { useRouter } from 'next/navigation';
const industry = ["Aerospace", "Defense", "Industrial", "Medical", "Oil / Gas", "Other"]

// Validation schemas
const accountSchema = z.object({
    fname: z.string({ required_error: 'First name is required' }),
    lname: z.string().optional(),
    industry: z.string().optional(),
    phone: z.string({ required_error: 'Phone number is required' }),
    address: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    billing_address: z.string().optional(),
    billing_country: z.string().optional(),
    billing_city: z.string().optional(),
    billing_state: z.string().optional(),
    billing_zipCode: z.string().optional(),
});

const passwordSchema = z
    .object({
        oldPassword: z.string({ required_error: 'Old password is required' }),
        newPassword: z.string({ required_error: 'New password is required' }).min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export function ProfileEditPage() {
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.userData)
    const { put } = ApiFunction()
    const {back} = useRouter()
    // Forms
    const {
        control,
        handleSubmit: handleAccountSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            fname: '',
            lname: '',
            industry: '',
            phone: '',
            address: '',
            country: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleAccountUpdate = async (data) => {
        setIsLoading(true);
        const nData = {
            ...data
        }
        await put(`users/update-user`, nData)
            .then((result) => {
                if (result.success) {
                    toast.success(result.message)
                    back()
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                setIsLoading(false)
            });
    };

    const handlePasswordChange = async (data) => {
        setIsLoading(true);
        setIsLoading(true);
        await put(`users/change-password`, data)
            .then((result) => {
                if (result.success) {
                    toast.success(result.message)
                    back()
                }
            }).catch((err) => {
                handleError(err)
            }).finally(() => {
                setIsLoading(false)
            });
    };
    const handleUserData = () => {
        setValue('fname', userData?.fname)
        setValue('lname', userData?.lname)
        setValue('email', userData?.email)
        setValue('company', userData?.company)
        setValue('phone', userData?.phone)
        setValue('otherIndustry', userData?.otherIndustry)

        setValue('city', userData?.city)
        setValue('address', userData?.address)
        setValue('industry', userData?.industry)
        setValue('zipCode', userData?.zipCode)
        setValue('state', userData?.state)

        dispatch(setCustomerData(userData))
    }
    useEffect(() => {
        if (userData) {
            handleUserData()
        }
    }, [userData]);

    return (
        <div className='flex-1 bg-white'>
            <div className="mx-auto p-6">
                <div className="mb-6">
                    <button
                        className={`px-4 py-2 border-b-2 ${activeTab === 'account' ? 'border-black' : 'border-transparent'}`}
                        onClick={() => setActiveTab('account')}
                    >
                        Account
                    </button>
                    <button
                        className={`px-4 py-2 border-b-2 ${activeTab === 'addresses' ? 'border-black' : 'border-transparent'}`}
                        onClick={() => setActiveTab('addresses')}
                    >
                        Addresses
                    </button>
                    <button
                        className={`px-4 py-2 border-b-2 ${activeTab === 'password' ? 'border-black' : 'border-transparent'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Change Password
                    </button>
                </div>

                {activeTab === 'account' && (
                    <form onSubmit={handleAccountSubmit(handleAccountUpdate)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1">
                            <div>
                                <Label htmlFor="fname">First Name</Label>
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
                                <Label htmlFor="company">Company</Label>
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
                                <Label htmlFor="email">Email</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            readOnly
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
                                <Label htmlFor="phone">Enter Phone</Label>
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
                                <Label htmlFor="industry">Industry</Label>
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
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Account'}
                        </Button>
                    </form>
                )}

                {activeTab === 'addresses' && (<UserAddresses />)}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
                        {/* Password Fields */}
                        <div>
                            <Label htmlFor="oldPassword">Old Password</Label>
                            <Controller
                                name="oldPassword"
                                control={passwordControl}
                                render={({ field }) => (
                                    <Input {...field} type="password" placeholder="Old Password" aria-invalid={!!passwordErrors.oldPassword} />
                                )}
                            />
                            {passwordErrors.oldPassword && <FormFeedback>{passwordErrors.oldPassword.message}</FormFeedback>}
                        </div>

                        <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Controller
                                name="newPassword"
                                control={passwordControl}
                                render={({ field }) => (
                                    <Input {...field} type="password" placeholder="New Password" aria-invalid={!!passwordErrors.newPassword} />
                                )}
                            />
                            {passwordErrors.newPassword && <FormFeedback>{passwordErrors.newPassword.message}</FormFeedback>}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Controller
                                name="confirmPassword"
                                control={passwordControl}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Confirm Password"
                                        aria-invalid={!!passwordErrors.confirmPassword}
                                    />
                                )}
                            />
                            {passwordErrors.confirmPassword && (
                                <FormFeedback>{passwordErrors.confirmPassword.message}</FormFeedback>
                            )}
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
