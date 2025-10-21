'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFeedback } from '@/components/ui/formFeedBack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import ApiFunction from '@/lib/api/apiFuntions';
import { CheckBox } from '@/components/ui/checkbox';
import { handleError } from '@/lib/api/errorHandler';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { useRouter } from 'next/navigation';
const ITEM_HEIGHT = 35; // Height per row

export function TerritoriesForm({ rowData }) {
    const { back } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isStates, setIsStates] = useState(false);
    const [isCountries, setIsCountries] = useState(false);
    const countriesList = useSelector(state => state.prod.countriesList) || []
    const statesList = useSelector(state => state.prod.statesList) || [];
    const usCountry = countriesList?.find(item => item?.iso === 'US')?._id || '';

    const sortedStates = statesList ? [...statesList].sort((a, b) => {
        // If both are US states → sort by name
        if (a.country === usCountry && b.country === usCountry) {
            return a.name.localeCompare(b.name);
        }
        // If only a is US → a comes first
        if (a.country === usCountry) return -1;
        // If only b is US → b comes first
        if (b.country === usCountry) return 1;

        // Both non-US → sort by name
        return a.name.localeCompare(b.name);
    }) : [];
    const { post, put } = ApiFunction()
    const schema = z.object({
        code: z.string({ required_error: 'Code is required' }),
        location: z.string({ required_error: 'Location is required' }),
    })
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            code: '',
            location: '',
            states: [],
            countries: []
        }
    });
    const selectedStates = watch('states')
    const selectedCountries = watch('countries')

    const onSubmit = async (data) => {
        const countryData = selectedCountries?.length > 0 ? selectedCountries?.map(item =>
            countriesList?.find(innerItem =>
                innerItem?._id === item
            )
        ) : [];

        const stateData = selectedStates?.length > 0 ? selectedStates?.map(item =>
            sortedStates?.find(innerItem =>
                innerItem?._id === item
            )
        ) : [];
        const finalData = {
            code: data.code,
            location: data.location,
            states: stateData?.length > 0 ? stateData?.map(item => ({ ...item, stateID: item?._id })) : [],
            countries: countryData?.length > 0 ? countryData?.map(item => ({ ...item, countryID: item?._id })) : [],
        };
        if (rowData) {
            await put(`territories/edit/${rowData?._id}`, finalData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        reset()
                        back()
                        setValue('countries', [])
                        setValue('states', [])
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(true)
            await post('territories/create', finalData)
                .then((result) => {
                    if (result.success) {
                        toast.success(result.message)
                        reset()
                        back()
                        setValue('countries', [])
                        setValue('states', [])
                    }
                }).catch((err) => {
                    handleError(err)
                }).finally(() => {
                    setIsLoading(false)
                })
        }
    };

    const handleSetUserData = (data) => {
        setValue('code', data?.code)
        setValue('location', data?.location)
        setValue('states', data?.states?.length > 0 ? data?.states?.map(item => item?._id) : [])
        setValue('countries', data?.countries?.length > 0 ? data?.countries?.map(item => item?._id) : [])
        if (data?.states?.length > 0) setIsStates(true)
        if (data?.countries?.length > 0) setIsCountries(true)
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
                        <div>
                            <Label htmlFor="code">Code:</Label>
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Code"
                                        aria-invalid={!!errors.code}
                                    />
                                )}
                            />
                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                        </div>
                        <div>
                            <Label htmlFor="location">Location:</Label>
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Location"
                                        aria-invalid={!!errors.location}
                                    />
                                )}
                            />
                            {errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                        </div>
                        <div>
                            <Button type='button' onClick={() => setIsStates(!isStates)} variant='outline'>Select US States</Button>
                            {isStates && <div className='pt-3'>

                                <Controller
                                    name="states"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field }) => {
                                        const Row = ({ index, style }) => {
                                            const item = sortedStates[index];
                                            const isChecked = field.value.includes(item?._id);

                                            return (
                                                <div className="pb-2 flex" key={index} style={style}>
                                                    <CheckBox
                                                        className="mr-2 h-4 w-4 rounded-[4px]"
                                                        checked={isChecked}
                                                        value={item?._id}
                                                        onChange={(e) => {
                                                            let newSelected = [...field.value];

                                                            if (e.target.checked) {
                                                                newSelected.push(item?._id);
                                                            } else {
                                                                newSelected = newSelected.filter(state => state !== item?._id);
                                                            }

                                                            setValue("states", newSelected);
                                                        }}
                                                    />
                                                    <Label htmlFor={item?._id} className="font-normal text-sm">
                                                        {item.name}
                                                    </Label>
                                                </div>
                                            );
                                        };

                                        return (
                                            <div className="pt-3" style={{ height: 500 }}> {/* Limit height for scroll */}
                                                <List
                                                    height={500}
                                                    itemCount={sortedStates?.length}
                                                    itemSize={ITEM_HEIGHT}
                                                    width="100%"
                                                >
                                                    {Row}
                                                </List>
                                            </div>
                                        );
                                    }}
                                />
                            </div>}
                        </div>
                        <div>
                            <Button type='button' onClick={() => setIsCountries(!isCountries)} variant='outline'>Select other countries</Button>
                            {isCountries && (
                                <div className="pt-3">
                                    <Controller
                                        name="countries"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => {
                                            const Row = ({ index, style }) => {
                                                const item = countriesList[index];
                                                const isChecked = field.value.includes(item?._id);

                                                return (
                                                    <div className="pb-2 flex" key={index} style={style}>
                                                        <CheckBox
                                                            className="mr-2 h-4 w-4 rounded-[4px]"
                                                            value={item?._id}
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                let newSelected = [...field.value];

                                                                if (e.target.checked) {
                                                                    newSelected.push(item?._id);
                                                                } else {
                                                                    newSelected = newSelected.filter(
                                                                        (countryId) => countryId !== item?._id
                                                                    );
                                                                }

                                                                setValue("countries", newSelected);
                                                            }}
                                                        />
                                                        <Label htmlFor={item?._id} className="font-normal text-sm">
                                                            {item.name}
                                                        </Label>
                                                    </div>
                                                );
                                            };

                                            return (
                                                <div className="pt-3" style={{ height: 500 }}>
                                                    <List
                                                        height={500}
                                                        itemCount={countriesList.length}
                                                        itemSize={ITEM_HEIGHT}
                                                        width="100%"
                                                    >
                                                        {Row}
                                                    </List>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex pt-3'>
                        <Button
                            type="submit"
                            className=""
                            size='sm'
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : rowData ? 'Update Territories' : 'Add Territories'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}