'use client'
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectOption } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckBox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioButton } from '@/components/ui/radioButton';

const schema = z.object({
    type: z.string(),
    password: z.string().min(1, 'Password is required'),
    username: z.string().min(1, 'Username is required'),
    integratorId: z.string().min(1, 'Integrator ID is required'),
    server: z.string().min(1),
    testMode: z.boolean(),
    display_on: z.enum(['both', 'front-end', 'back-end']),
    auto_capture: z.enum(['', 'true', 'false']),
    active: z.enum(['true', 'false']),
    name: z.string().min(1),
    description: z.string().optional(),
});

const PaymentMethodForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            type: 'Gateway::PayTrace',
            password: '',
            username: '',
            integratorId: '',
            server: 'production',
            testMode: false,
            display_on: 'both',
            auto_capture: '',
            active: 'true',
            name: 'Pay by Credit Card',
            description: 'PayTraceGateway',
        },
    });

    const onSubmit = (data) => {
        console.log('Form submitted', data);
    };

    return (
        <>
            <div className="border-b pb-2 mb-4">
                <h4 className="text-2xl  font-medium">Payment Methods </h4>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className=" grid  sm:grid-cols-2 grid-cols-1 gap-5 ">
                <div className=" space-y-3 ">
                    <div>
                        <Label htmlFor="gtwy-type">Gateway Type</Label>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <Select id="gtwy-type" {...field}>
                                    <SelectOption value="Gateway::GotoBilling">GotoBilling</SelectOption>
                                    <SelectOption value="Gateway::PayTrace">PayTrace</SelectOption>
                                    <SelectOption value="Spree::Gateway::Bogus">Bogus</SelectOption>
                                    <SelectOption value="Spree::Gateway::BogusSimple">BogusSimple</SelectOption>
                                    <SelectOption value="Spree::PaymentMethod::Check">Check</SelectOption>
                                    <SelectOption value="Spree::PaymentMethod::StoreCredit">Store Credit</SelectOption>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <Label>Password</Label>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <Input type="password" {...field} />
                            )}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    {/* User Name */}
                    <div>
                        <Label>User Name</Label>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field }) => (
                                <Input type="text" {...field} />
                            )}
                        />
                        {errors.username && <p>{errors.username.message}</p>}
                    </div>

                    {/* Integrator ID */}
                    <div>
                        <Label>Integrator ID</Label>
                        <Controller
                            control={control}
                            name="integratorId"
                            render={({ field }) => (
                                <Input type="text" {...field} />
                            )}
                        />
                        {errors.integratorId && <p>{errors.integratorId.message}</p>}
                    </div>

                    {/* Server */}
                    <div>
                        <Label>Server</Label>
                        <Controller
                            control={control}
                            name="server"
                            render={({ field }) => (
                                <Input type="text" {...field} />
                            )}
                        />
                        {errors.server && <p>{errors.server.message}</p>}
                    </div>
                    {/* Display On */}
                    <div>
                        <Label>Display On</Label>
                        <Controller
                            control={control}
                            name="display_on"
                            render={({ field }) => (
                                <Select {...field}>
                                    <SelectOption value="both">Both</SelectOption>
                                    <SelectOption value="front-end">Front End</SelectOption>
                                    <SelectOption value="back-end">Backend</SelectOption>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Auto Capture */}
                    <div>
                        <Label>Auto Capture</Label>
                        <Controller
                            control={control}
                            name="auto_capture"
                            render={({ field }) => (
                                <Select {...field}>
                                    <SelectOption value="">Use App Default (false)</SelectOption>
                                    <SelectOption value="true">Yes</SelectOption>
                                    <SelectOption value="false">No</SelectOption>
                                </Select>
                            )}
                        />
                    </div>
                    {/* Test Mode */}
                    <div>
                        <Label className="flex gap-2 items-center">
                            <Controller
                                name="testMode"
                                control={control}
                                render={({ field }) => (
                                    <CheckBox
                                        {...field}
                                        aria-invalid={!!errors.testMode}
                                        className="mr-2"
                                        checked={field.value} // Make sure the checkbox is linked to field.value
                                        onChange={(e) => field.onChange(e.target.checked)} // Update field value on change
                                    />
                                )}
                            />{" "}
                            Test Mode
                        </Label>
                    </div>


                    {/* Active */}
                    <div>
                        <Label>Active</Label>
                        <Controller
                            name="active"
                            control={control}
                            id={`active-1`}
                            render={({ field }) => (
                                <Label className="font-normal text-sm flex items-center gap-3">
                                    <RadioButton
                                        {...field}
                                        checked={field.value === 'true'} // Ensure only the selected value is checked
                                        onChange={field.onChange} // Update form state correctly
                                        value={'true'}
                                        aria-invalid={!!errors.active}
                                    />
                                    Yes
                                </Label>
                            )}
                        />
                        <Controller
                            name="active"
                            control={control}
                            id={`active-2`}
                            render={({ field }) => (
                                <Label className="font-normal text-sm flex items-center gap-3">
                                    <RadioButton
                                        {...field}
                                        checked={field.value === 'false'} // Ensure only the selected value is checked
                                        onChange={field.onChange} // Update form state correctly
                                        value={'false'}
                                        aria-invalid={!!errors.active}
                                    />
                                    No
                                </Label>
                            )}
                        />
                    </div>
                </div>

                <div>
                    {/* Name */}
                    <div>
                        <Label>Name</Label>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <Input type="text" {...field} />
                            )}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <Textarea rows={6} {...field} />
                            )}
                        />
                    </div>

                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update"}
                </Button>
            </form>
        </>
    );
};

export default PaymentMethodForm;
