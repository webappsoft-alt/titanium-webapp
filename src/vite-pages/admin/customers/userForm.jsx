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
import { CheckBox } from '@/components/ui/checkbox';
import PhoneInput from 'react-phone-number-input'
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerData, setRolesList } from '@/lib/redux/products';
import { usePathname, useRouter } from 'next/navigation';
// Validation schema
const industry = ["Aerospace", "Defense", "Industrial", "Medical", "Oil / Gas", "Other"]
const customerStatusOptions = [
    { label: "Customer", value: "C" },
    { label: "Lost Customer", value: "L" },
    { label: "Prospect", value: "P" },
    { label: "Inactive Customer", value: "I" },
    { label: "3 Month Dormant", value: "3MD" },
    { label: "6 Month Dormant", value: "6MD" },
];

const keyValueSchema = z.object({
    label: z.string().optional(),
    value: z.string().optional()
});
export function UserForm() {
    const navigate = useRouter();
    const rowData = useSelector(state => state.prod.customerData)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const userData = useSelector(state => state.auth.userData)
    const countriesList = useSelector(state => state.prod.countriesList) || []
    const rolesList = useSelector(state => state.prod.rolesList) || []
    const statesList = useSelector(state => state.prod.statesList) || []
    const { post, put, get } = ApiFunction()
    const [discountValue, setDiscountValue] = useState("");
    const competMarkup = useSelector(state => state.prod.competMarkup)
    const [isAccpectLoading, setIsAccpectLoading] = useState(false);
    const pathname = usePathname()
    const isCreateCustomer = pathname === '/dashboard/customers/add'

    const schema = z.object({
        fname: z.string({ required_error: 'First name is required' }),
        company: z.string({ required_error: 'Company name is required' }),
        lname: z.string().min(0).optional(),
        address: z.string().min(0),
        stratixAccount: z.string().min(0).optional(),

        customerStatus: keyValueSchema.optional(),
        accountManager: keyValueSchema.optional(),
        salesRep: keyValueSchema.optional(),
        regionalManager: keyValueSchema.optional(),
        industry: keyValueSchema.optional(),
        assignBranch: keyValueSchema.optional(),
        country: keyValueSchema.optional(),
        state: keyValueSchema.optional(),

        discount: discountValue ? z.string()
            .regex(/^[-+]\d+$/, 'Discount must be in the format "+10" or "-10"') // Ensures it starts with "+" or "-"
            .optional() : z.string().optional(),
        isCompetitor: z.boolean().optional(),
        otherIndustry: z.string().min(0).optional(),
        zipCode: z.string().min(0),
        city: z.string().min(0),
        phone: z.string().optional(),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    })
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            phone: '',
            customerStatus: {},
            country: {},
            state: {},
            assignBranch: {},
            industry: {},
            regionalManager: {},
            salesRep: {},
            accountManager: {},
        }
    });
    const isCompetitor = watch('isCompetitor')
    const discount = watch('discount')

    const country = watch('country')
    const state = watch('state')
    const assignBranch = watch('assignBranch')
    const filterStateList = statesList?.filter(item => item?.country === country?.value) || []
    const isDisabled = (userData?.type === 'sub-admin' && userData?.permissions != 'admin')

    const branchValue = assignBranch?.value;

    // helper to filter by branch
    const filterByBranch = (list) =>
        Array.isArray(list)
            ? branchValue
                ? list.filter((item) => item?.branch.includes(branchValue))
                : list
            : [];

    // final lists
    const accountManagerList = filterByBranch(rolesList?.accountManager);
    const regionalManagerList = filterByBranch(rolesList?.regionalManager);
    const salesRepList = filterByBranch(rolesList?.salesRep);

    const [territoriesList, setTerritoriesList] = useState([]);

    const handleGetTerritories = async (pageNo = 1) => {
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
    const handleAcceptCustomer = (id, status) => {
        setIsAccpectLoading(true);
        put(`users/change/${status}/${id}`)
            .then((result) => {
                if (result.success) {
                    toast.success(result.message);
                    const nData = { ...rowData, status: status }
                    dispatch(setCustomerData(nData))
                }
            })
            .catch((err) => {
                handleError(err);
            })
            .finally(() => {
                setIsAccpectLoading(false);
            });
    };
    const handleGet = async () => {
        if (rolesList?.accountManager?.length > 0) {
            return
        }
        setIsLoading(true)
        await get(`users/titanium/roles`)
            .then((result) => {
                if (result.success) {
                    dispatch(setRolesList(result.data))
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        handleGetTerritories()
        handleGet()
    }, []);
    const onSubmit = async (data) => {
        const nData = {
            ...data,
            accountManager: data?.accountManager?.value || null,
            regionalManager: data?.regionalManager?.value || null,
            salesRep: data?.salesRep?.value || null,
            assignBranch: data?.assignBranch?.value || null,
            industry: data?.industry?.value || null,
            customerStatus: data?.customerStatus?.value || '',
            discount: discount,

            countryID: data?.country?.value || null,
            country: data?.country?.label || null,
            old_country_id: countriesList?.find(item => item?._id === country)?.old_id,

            stateID: data?.state?.value || null,
            state: data?.state?.label || null,
            old_state_id: filterStateList?.find(item => item?._id === state)?.old_id,
        }
        setIsLoading(true);
        if (rowData) {
            await put(`users/update-user/${rowData?._id}`, nData)
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
            await post(`users/admin/create-user`, nData)
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

    const handleSetUserData = (user) => {
        setValue('fname', user?.fname)
        setValue('lname', user?.lname)
        setValue('email', user?.email)
        setValue('phone', user?.phone)
        setValue('address', user?.address)
        setValue('city', user?.city)
        // setValue('country', user?.country)
        // setValue('state', user?.state)
        setValue('zipCode', user?.zipCode)
        setValue('company', user?.company)
        setValue('assignBranch', { label: user?.assignBranch?.code, value: user?.assignBranch?._id })
        setValue('industry', { label: user?.industry, value: user?.industry })
        const customerStatusData = user?.customerStatus ? customerStatusOptions.find(item => (item.value === user?.customerStatus)) : {}
        setValue('customerStatus', customerStatusData)

        const countryD = countriesList?.find(item => item?._id === user?.countryID)
        setValue('country', ({ label: countryD?.name, value: countryD?._id, }))

        const stateD = statesList?.find(item => item?._id === user?.stateID) || null
        setValue('state', ({ label: stateD?.name, value: stateD?._id }))

        setValue('otherIndustry', user?.otherIndustry)
        setValue('isCompetitor', user?.isCompetitor)
        setValue('discount', user?.discount)
        setValue('regionalManager', { label: user?.regionalManager?.email ? `${user?.regionalManager?.fname} ${user?.regionalManager?.lname || ''} (${user?.regionalManager?.email})` : '', value: user?.regionalManager?._id })
        setValue('salesRep', { label: user?.salesRep?.email ? `${user?.salesRep?.fname || ''} ${user?.salesRep?.lname || ''} (${user?.salesRep?.email || ''})` : '', value: user?.salesRep?._id })
        setValue('accountManager', { label: user?.accountManager?.email ? `${user?.accountManager?.fname} ${user?.accountManager?.lname || ''} (${user?.accountManager?.email})` : '', value: user?.accountManager?._id })
        setValue('stratixAccount', user?.stratixAccount)
    }
    useEffect(() => {
        if (rowData) {
            handleSetUserData(rowData)
        }
    }, [rowData]);

    return (
        <div className="pb-20">
            {!isCreateCustomer && <div className='my-3 flex justify-end'>
                {rowData?.status === "deactivated" ? (
                    <Button
                        variant={"primary"}
                        size="sm"
                        disabled={isAccpectLoading}
                        onClick={() =>
                            handleAcceptCustomer(
                                rowData?._id,
                                rowData?.status === "active" ? "deactivated" : "active"
                            )
                        }
                    >
                        Deactivated - Click to toggle Activate
                    </Button>
                ) : (
                    <Button
                        variant={rowData?.status === "active" ? "secondary" : "danger"}
                        size="sm"
                        className={
                            rowData?.status === "active" ? "" :
                                rowData?.status === "inactive" ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-red-600 text-white hover:bg-red-700"
                        }
                        disabled={isAccpectLoading}
                        onClick={() =>
                            handleAcceptCustomer(
                                rowData?._id,
                                rowData?.status === "active" ? "deactivated" : "active"
                            )
                        }
                    >
                        {rowData?.status === "active" ? (
                            "Active - Click to toggle Deactivate"
                        ) : rowData?.status === "inactive" ? (
                            "Pending Approval - Click to toggle Approved"
                        ) : isAccpectLoading ? (
                            "Accpet...."
                        ) : (
                            "Accept"
                        )}
                    </Button>
                )}
            </div>}
            <div className="w-full space-y-8">

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-x-3 gap-y-3 max-sm:grid-cols-1'>
                        {/* First Name */}
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
                                        {...field}
                                        readOnly={!!rowData}
                                        placeholder="Your Email Address"
                                        aria-invalid={!!errors.email}
                                    />
                                )}
                            />
                            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="assignBranch">Branch Assigned</Label>
                            <Controller
                                name="assignBranch"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        options={territoriesList?.map((item) => ({ label: item?.code, value: item?._id }))}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        aria-invalid={!!errors.assignBranch}>
                                    </Select>
                                )}
                            />

                            {errors.assignBranch && <FormFeedback>{errors.assignBranch.message}</FormFeedback>}
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
                        <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Controller
                                name="industry"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        required={false}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        options={industry.map((item, index) => ({ label: item, value: item }))}
                                    >
                                    </Select>
                                )}
                            />
                            {errors.industry && <FormFeedback>{errors.industry.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="otherIndustry">Other Industry</Label>
                            <Controller
                                name="otherIndustry"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="otherIndustry"
                                        aria-invalid={!!errors.otherIndustry}
                                    />
                                )}
                            />
                            {errors.otherIndustry && <FormFeedback>{errors.otherIndustry.message}</FormFeedback>}
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
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Controller
                                name="country"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        // aria-invalid={!!errors.country}
                                        options={countriesList?.map((item, index) => ({ label: item?.name, value: item?._id }))}
                                    >
                                    </Select>
                                )}
                            />

                            {errors.country && <FormFeedback>{errors.country.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="city">City</Label>
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
                            <Label htmlFor="zipCode">Zip Code</Label>
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
                            <Label htmlFor="state">State</Label>
                            <Controller
                                name="state"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        isDisabled={!country?.value}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        // aria-invalid={!!errors.country}
                                        options={filterStateList?.map((item, index) => ({ label: item?.name, value: item?._id }))}
                                    >
                                    </Select>
                                )}
                            />
                            {!country?.value && <FormFeedback>Please Select Country</FormFeedback>}
                            {errors.state && <FormFeedback>{errors.state.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="stratixAccount">Stratix Account Number</Label>
                            <Controller
                                name="stratixAccount"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="stratixAccount"
                                        aria-invalid={!!errors.stratixAccount}
                                    />
                                )}
                            />
                            {errors.stratixAccount && <FormFeedback>{errors.stratixAccount.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="customerStatus">Customer Status</Label>
                            <Controller
                                name="customerStatus"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        required={false}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        options={customerStatusOptions.map((item, index) => ({ label: item?.label, value: item?.value }))}
                                    >
                                    </Select>
                                )}
                            />
                            {errors.customerStatus && <FormFeedback>{errors.customerStatus.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="accountManager">Account Manager (OS)</Label>
                            <Controller
                                name="accountManager"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        isDisabled={isDisabled}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        options={accountManagerList?.map(item => ({
                                            label: `${item.fname} ${item.lname || ''} (${item.email})`,
                                            value: item._id,
                                        }))}
                                    // aria-invalid={!!errors.accountManager}
                                    >
                                    </Select>
                                )}
                            />
                            {errors.accountManager && <FormFeedback>{errors.accountManager.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="salesRep">Sales Rep (IS)</Label>
                            <Controller
                                name="salesRep"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        isDisabled={isDisabled}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        options={salesRepList?.map(item => ({
                                            label: `${item.fname} ${item.lname || ''} (${item.email})`,
                                            value: item._id,
                                        }))}
                                    >

                                    </Select>
                                )}
                            />
                            {errors.salesRep && <FormFeedback>{errors.salesRep.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="regionalManager">Regional Manager (RM)</Label>
                            <Controller
                                name="regionalManager"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <Select
                                        isClearable
                                        {...field}
                                        isDisabled={isDisabled}
                                        onChange={(e) => {
                                            field.onChange(e === null ? {} : e)
                                        }}
                                        options={regionalManagerList?.map(item => ({
                                            label: `${item.fname} ${item.lname || ''} (${item.email})`,
                                            value: item._id,
                                        }))}
                                    // aria-invalid={!!errors.regionalManager}
                                    >
                                    </Select>
                                )}
                            />
                            {errors.regionalManager && <FormFeedback>{errors.regionalManager.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="discount">Discount / Premium ("-" is discount, "+" is premium)</Label>
                            <Controller
                                name="discount"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="discount"
                                        aria-invalid={!!errors.discount}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setDiscountValue(e.target.value)
                                        }}
                                    />
                                )}
                            />
                            {errors.discount && <FormFeedback>{errors.discount.message}</FormFeedback>}
                        </div>
                    </div>
                    <div className="pb-3 flex">
                        <Controller
                            name="isCompetitor"
                            control={control}
                            render={({ field }) => (
                                <CheckBox
                                    {...field}
                                    aria-invalid={!!errors.isCompetitor}
                                    className="mr-2"
                                    checked={field.value} // Make sure the checkbox is linked to field.value
                                    onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                                />
                            )}
                        />
                        <Label htmlFor="isCompetitor">Competitor (Random {competMarkup?.minValue}%-{competMarkup?.maxValue}% markup)</Label>
                    </div>
                    {/* Submit Button */}
                    <div className='flex'>
                        <Button
                            type="submit"
                            className=""
                            size='sm'
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : rowData ? 'Update Customer' : 'Add Customer'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}