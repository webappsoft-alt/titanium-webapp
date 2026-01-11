'use client'
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { pdf, } from '@react-pdf/renderer';
import ApiFunction from '@/lib/api/apiFuntions';
import { useDispatch, useSelector } from 'react-redux';
import { handleError } from '@/lib/api/errorHandler';
import { RadioButton } from '@/components/ui/radioButton';
import QuotationPDFTemplate from '@/components/admin/quote-pdf-template';
import { useRouter } from 'next/navigation';

// Validation schema for address fields
const schema = (isInvoice) => z.object({
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
export function PaymentCard({ setIsActive, quoteData }) {
    const [isLoading, setIsLoading] = useState(false);
    const userData = useSelector(state => state.auth.userData)
    const checkoutData = useSelector(state => state.checkout.checkoutData)
    const { post, put, header2 } = ApiFunction()
    const [isInvoice, setIsInvoice] = useState(false);
    const dispatch = useDispatch()
    const { push } = useRouter()
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

        try {
            setIsLoading(true)
            const response = await post('quotation/create', { ...data, ...checkoutData, totalAmount: (checkoutData?.totalAmount + checkoutData?.frieght || 0).toFixed(2) })
            if (response?.success) {
                const blob = await pdf(<QuotationPDFTemplate quotationData={response?.quotation} />).toBlob();

                const formData = new FormData();
                formData.append('pdf', blob, 'quotation.pdf');

                await put(`quotation/resend/${response?.quotation?._id}/sales-cart`, formData, { headers: header2 })
                toast.success(response?.message)
                push('/quick-quote')
            }
        } catch (error) {
            console.log(error)
            handleError(error)
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (paymentMethod) {
            setIsInvoice(paymentMethod !== 'Pay By Credit Card')
        }
    }, [paymentMethod]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Billing Address Section */}
            <div className={``}>

                <h2 className="text-xl font-bold">Payment Information</h2>
                <p>Credit Card will not be charged at this time. All information is stored securely and charged prior to order shipment.</p>
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
                        <label className="block font-medium">Name on Card *</label>
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
                        <label className="block font-medium">Card Number *</label>
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
                            <label className="block font-medium">CVV *</label>
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
                            <label className="block font-medium">Expiration *</label>
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

            <div className="flex flex-col gap-4 max-w-sm">
                <div className="grid grid-cols-2 gap-2 text-left text-lg font-semibold">
                    {checkoutData?.frieght > 0 && <>


                        <div>Subtotal:
                            <span className="text-base font-normal">
                                {checkoutData?.user?.discount ? `(${checkoutData?.user?.discount}%)` : ''}
                            </span>
                        </div>
                        <div className="text-blue-600 ">${checkoutData?.subtotal?.toFixed(2)}</div>

                        <div>Frieght: </div>
                        <div className="text-blue-600">${checkoutData?.frieght?.toFixed(2) || '0.00'}</div>
                    </>}
                    <div>Quote Total:
                        <span className="text-base font-normal">
                            {userData?.discount ? ` (${userData?.discount}%)` : ''}
                        </span>
                    </div>
                    <div className="text-blue-600 ">${(checkoutData?.totalAmount + checkoutData?.frieght || 0)?.toFixed(2)}</div>

                    {/* <div>Tax: </div>
                    <div className="text-blue-600">${checkoutData?.tax?.toFixed(2) || '0.00'}</div>

                    <div>Quote Total: </div>
                    <div className="text-blue-600">${checkoutData?.totalAmount}</div> */}
                </div>
            </div>

            <div className='flex gap-3 items-center'>
                <Button type="submit" className="" disabled={isLoading}>
                    {isLoading ? 'Finish Quote...' : 'Finish Quote'}
                </Button>
                <Button type="button" variant='outline' className="" onClick={() => setIsActive('2')} disabled={isLoading}>
                    {'Previous'}
                </Button>
            </div>
        </form>
    );
}