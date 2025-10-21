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
import { CheckBox } from '@/components/ui/checkbox';
import PhoneInput from 'react-phone-number-input'
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import { RadioButton } from '@/components/ui/radioButton';
import { useRouter } from 'next/navigation';

// Validation schema
const industry = ["Aerospace", "Defense", "Industrial", "Medical", "Oil / Gas", "Other"]

export function TitaniumUserForm({ rowData }) {
    const navigate = useRouter();
    const [password, setPassword] = useState('');
    const [territoriesList, setTerritoriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { post, put, get } = ApiFunction()
    const schema = z.object({
        fname: z.string({ required_error: 'First name is required' }).optional(),
        phone: z.string({ required_error: 'Phone Number is required' }).optional(),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
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
    const branch = watch('branch')
    const routing = watch('routing')
    const roles = watch('roles')
    const permissions = watch('permissions')

    const handleGet = async (pageNo = 1) => {
        await get(`territories/all`)
            .then((result) => {
                if (result.success) {
                    setTerritoriesList(result.territories)
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
            })
    }
    useEffect(() => {
        handleGet()
    }, []);
    const onSubmit = async (data) => {
        const nData = {
            email: data?.email,
            password: data?.password,
            fname: data?.fname,
            phone: data?.phone,
            routing,
            branch, roles, permissions
        }
        setIsLoading(true);
        if (rowData) {
            await put(`users/titanium/${rowData?._id}`, nData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        navigate.back()
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                });
        } else {
            await post(`users/register/titanium`, nData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        navigate.back()
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
    const handleSetUserData = (user) => {
        setValue('fname', user?.fname)
        setValue('email', user?.email)
        setValue('phone', user?.phone)
        setValue('roles', user?.roles)
        setValue('permissions', user?.permissions)
        setValue('branch', user?.branch?.length > 0 ? user?.branch?.map(item => (item?._id ? item?._id : item)) : [])
        setValue('routing', user?.routing?.length > 0 ? user?.routing?.map(item => (item?._id ? item?._id : item)) : [])
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
                            <Label htmlFor="fname">Full Name</Label>
                            <Controller
                                name="fname"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Full Name"
                                        aria-invalid={!!errors.fname}
                                    />
                                )}
                            />
                            {errors.fname && <FormFeedback>{errors.fname.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={!!rowData}
                                        placeholder="Your Email Address"
                                        aria-invalid={!!errors.email}
                                    />
                                )}
                            />
                            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                        </div>
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
                                        className="phone-input-container relative mb-0F" // Apply custom input styling
                                        onChange={(e) => field.onChange(e)}
                                    />
                                )}
                            />
                            {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                        </div>
                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
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
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                    </div>
                    <div className='grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1' >
                        <div className='flex gap-12'>
                            <div>
                                <h6 className='text-sm font-medium'  >Branch</h6>
                                <div className="mt-3">
                                    <Controller
                                        name="branch"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => (
                                            <div className="pt-3">
                                                {territoriesList.map((item, index) => {
                                                    const isChecked = field.value.includes(item?._id); // Check if selected
                                                    return (
                                                        <div className="pb-2 flex" key={index}>
                                                            <CheckBox
                                                                className="mr-2 h-4 w-4 rounded-[4px]"
                                                                value={item?._id}
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    let newSelected = [...field.value];

                                                                    if (e.target.checked) {
                                                                        newSelected.push(item?._id); // Add country code
                                                                    } else {
                                                                        newSelected = newSelected.filter(country => country !== item?._id); // Remove if unchecked
                                                                    }
                                                                    setValue("branch", newSelected); // Update array in form state
                                                                }}
                                                            />
                                                            <Label htmlFor={item.code} className="font-normal text-sm">
                                                                {item?.code}
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div>
                                <h6 className='text-sm font-medium' >Routing</h6>
                                <div className="mt-3">
                                    <Controller
                                        name="routing"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => (
                                            <div className="pt-3">
                                                {territoriesList.map((item, index) => {
                                                    const isChecked = field.value.includes(item?._id); // Check if selected
                                                    return (
                                                        <div className="pb-2 flex" key={index}>
                                                            <CheckBox
                                                                className="mr-2 h-4 w-4 rounded-[4px]"
                                                                value={item?._id}
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    let newSelected = [...field.value];

                                                                    if (e.target.checked) {
                                                                        newSelected.push(item?._id); // Add country code
                                                                    } else {
                                                                        newSelected = newSelected.filter(country => country !== item?._id); // Remove if unchecked
                                                                    }
                                                                    setValue("routing", newSelected); // Update array in form state
                                                                }}
                                                            />
                                                            <Label htmlFor={item.code} className="font-normal text-sm">
                                                                {item?.code}
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h6 className="text-sm font-medium mb-3">Permissions</h6>
                            {[
                                { label: "Admin", value: "admin" },
                                { label: "Regional Manager", value: "regional_manager" },
                                { label: "Sales Representative", value: "sales_representative" },
                            ].map(({ label, value }) => (
                                <div key={value} className="pb-3 flex items-center">
                                    <Controller
                                        name="permissions"
                                        control={control}
                                        id={`permissions-${value}`}
                                        render={({ field }) => (
                                            <RadioButton
                                                {...field}
                                                checked={field.value === value} // Ensure only the selected value is checked
                                                onChange={() => field.onChange(value)} // Update form state correctly
                                                value={value}
                                                aria-invalid={!!errors.permissions}
                                            />
                                        )}
                                    />
                                    <Label htmlFor={`permissions-${value}`} className="font-normal ms-3 text-sm">
                                        {label}
                                    </Label>
                                </div>
                            ))}
                            <div>
                                <h6 className='text-sm font-medium mt-3'>Roles</h6>
                                <Controller
                                    name="roles"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <div className="pt-3">
                                            {[
                                                { code: "OS", name: "Account Manager (OS)" },
                                                { code: "IS", name: "Sales Rep (IS)" },
                                                { code: "RM", name: "Regional Manager (RM)" },
                                            ].map((item, index) => {
                                                const isChecked = field.value.includes(item.code); // Check if selected
                                                return (
                                                    <div className="pb-2 flex" key={index}>
                                                        <CheckBox
                                                            className="mr-2 h-4 w-4 rounded-[4px]"
                                                            value={item.code}
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                let newSelected = [...field.value];

                                                                if (e.target.checked) {
                                                                    newSelected.push(item.code); // Add country code
                                                                } else {
                                                                    newSelected = newSelected.filter(country => country !== item.code); // Remove if unchecked
                                                                }
                                                                setValue("roles", newSelected); // Update array in form state
                                                            }}
                                                        />
                                                        <Label htmlFor={item.code} className="font-normal text-sm">
                                                            {item.name}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                />
                            </div>
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
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : rowData ? 'Update Titanium User' : 'Add Titanium User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}