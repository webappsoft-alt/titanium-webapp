'use client'
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from '@/components/ui/radioButton';

// Validation schema for address fields
const schema = (isInvoice) => z.object({
    amount: z.string().min(2, "Amount is required"),
    // name: isInvoice ? z.string().optional() : z.string().min(2, "Name is required"),
    // cardNumber: isInvoice ? z.string().optional() : z.string().min(16, "Card number must be at least 16 digits"),
    // cvv: isInvoice ? z.string().optional() : z.string().min(3).max(4, "CVV must be 3 or 4 digits"),
    // expiration: isInvoice ? z.string().optional() : z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiration format"),
    paymentMethod: z.string().min(1, { message: 'shipping Method is required' }),
});

const paymentMethodOption = [
    // { label: "Pay By Credit Card", value: "Pay By Credit Card" },
    { label: "Pay By Invoice", value: "Pay By Invoice" },
]
export function PaymentAdminCard() {
    const [isLoading, setIsLoading] = useState(false);
    const { post } = ApiFunction()
    const [isInvoice, setIsInvoice] = useState(false);
    const quote = useSelector(state => state.prod.quoteData)

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(schema(isInvoice)),
        defaultValues: {
            paymentMethod: 'Pay By Invoice',
            amount: quote?.totalAmount
        },
    });
    const paymentMethod = watch('paymentMethod')
    const cardIcons = [
        { src: "https://cdn.jsdelivr.net/npm/payment-icons@1.0.0/min/flat/visa.svg", alt: "Visa" },
        { src: "https://cdn.jsdelivr.net/npm/payment-icons@1.0.0/min/flat/mastercard.svg", alt: "MasterCard" },
        { src: "https://cdn.jsdelivr.net/npm/payment-icons@1.0.0/min/flat/amex.svg", alt: "Amex" },
        { src: "https://cdn.jsdelivr.net/npm/payment-icons@1.0.0/min/flat/discover.svg", alt: "Discover" },
    ];
    const onSubmit = async (data) => {

    };
    useEffect(() => {
        if (paymentMethod) {
            setIsInvoice(paymentMethod !== 'Pay By Credit Card')
        }
    }, [paymentMethod]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <Label className="block font-medium">Amount *</Label>
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder="Amount"
                            className="w-full p-2 border rounded mt-1"
                        />
                    )}
                />
                {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
            </div>
            <div>
                {paymentMethodOption.map(({ label, value }) => (
                    <div key={value} className="pb-3 flex items-center">
                        <Controller
                            name="paymentMethod"
                            control={control}
                            id={`paymentMethod-${value}`}
                            render={({ field }) => (
                                <Label className="font-normal text-sm flex items-center gap-3">
                                    <RadioButton
                                        {...field}
                                        checked={field.value === value} // Ensure only the selected value is checked
                                        onChange={() => field.onChange(value)} // Update form state correctly
                                        value={value}
                                        aria-invalid={!!errors.paymentMethod}
                                    />
                                    {label}
                                </Label>
                            )}
                        />
                    </div>
                ))}
            </div>
            {/* {paymentMethod === 'Pay By Credit Card' && <>

                <div className="flex items-center space-x-3">
                    {cardIcons.map((card) => (
                        <img key={card.alt} src={card.src} alt={card.alt} className="h-8" />
                    ))}
                </div>

                <div className='max-w-lg space-y-3'>
                    <div>
                        <Label className="block font-medium">Name on Card *</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Name"
                                    className="w-full p-2 border rounded mt-1"
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="block font-medium">Card Number *</Label>
                        <Controller
                            name="cardNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full p-2 border rounded mt-1"
                                />
                            )}
                        />
                        {errors.cardNumber && (
                            <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <Label className="block font-medium">CVV *</Label>
                            <Controller
                                name="cvv"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="123"
                                        className="w-full p-2 border rounded mt-1"
                                    />
                                )}
                            />
                            {errors.cvv && (
                                <p className="text-sm text-red-500">{errors.cvv.message}</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <Label className="block font-medium">Expiration *</Label>
                            <Controller
                                name="expiration"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="MM / YY"
                                        className="w-full p-2 border rounded mt-1"
                                    />
                                )}
                            />
                            {errors.expiration && (
                                <p className="text-sm text-red-500">{errors.expiration.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </>} */}

            <div className='flex gap-3 items-center'>
                <Button type="submit" className="" disabled={isLoading}>
                    {isLoading ? 'Continue...' : 'Continue'}
                </Button>
            </div>
        </form>
    );
}