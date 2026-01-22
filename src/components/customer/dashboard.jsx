'use client'
import { ArrowRight, ShoppingBasket, ShoppingCart } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import ApiFunction from '@/lib/api/apiFuntions'
import SpinnerOverlay from '../ui/spinnerOverlay'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from "next/dynamic";
import FavoriteProduct from '../products/favorite-products'
const QuotationGenerator = dynamic(() => import("../admin/quote-pdf"), { ssr: false });

const DetailItem = ({ label, value }) => (
    <div className="">
        <span className="font-medium text-gray-700">{label}:</span>{' '}
        <span className="text-muted-foreground">{value}</span>
    </div>
);

const CustomerDashboard = () => {
    const userData = useSelector(state => state.auth.userData)
    const { get } = ApiFunction()
    const [quotData, setQuotData] = useState({ quotations: [], orders: [] });
    const [isLoading, setIsLoading] = useState(false);
    const { push } = useRouter()
    const handleGetQuotes = useCallback(async () => {
        setIsLoading(true)
        await get('quotation/user', { stats: 'dashboard' })
            .then((result) => {
                setQuotData(result)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }, [])
    useEffect(() => {
        handleGetQuotes()
    }, []);
    return (
        <div className='space-y-5'>
            {isLoading && <> <SpinnerOverlay /> </>}
            <div className="rounded-2xl border bg-white p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
                    <Link href="/customer/profile-account">
                        <Button variant="ghost" size="sm" className="text-sm">
                            Edit Account Detail
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <DetailItem label="Name" value={`${userData?.fname || '-'} ${userData?.lname || ''}`} />
                    <DetailItem label="Email" value={userData?.email || '-'} />
                    <DetailItem label="Phone" value={userData?.phone || '-'} />
                    <DetailItem label="Company" value={userData?.company || '-'} />
                    <DetailItem label="Ship To Address" value={userData?.shippingAddress?.address1 || '-'} />
                    <DetailItem label="Billing Address" value={userData?.billingAddress?.address1 || '-'} />
                </div>
            </div>
            <div className="space-y-6 overflow-x-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Quotes Box */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Quotes</h2>
                            <Button
                                onClick={() => push('/customer/quotes')}
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                View <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {quotData?.quotations?.map((item, index) => (
                                <div
                                    key={index}
                                    className=" text-gray-700 border-b pb-2  text-sm"
                                >
                                    <div className="max-xl:flex items-center gap-2  xl:hidden">
                                        <strong>Quote:</strong>
                                        <div className="">
                                            <QuotationGenerator id={item?._id} quoteId={item?.quoteNo} />
                                        </div>
                                    </div>
                                    <div className='flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2'>
                                        <div className="text-xs text-gray-500">{moment(item?.createdTS || item?.createdAt).format('lll')}</div>

                                        <div className=" xl:flex items-center gap-2 break-words max-xl:hidden">
                                            <strong>Quote:</strong>
                                            <div className="">
                                                <QuotationGenerator id={item?._id} quoteId={item?.quoteNo} />
                                            </div>
                                        </div>

                                        <div className="font-bold text-green-600 whitespace-nowrap">${item?.totalAmount}</div>

                                        {item?.type === 'open-quote' && item?.status === 'pending' && (
                                            <Link href="/customer/cart" className="text-primary hover:opacity-80 whitespace-nowrap">
                                                <ShoppingCart className="ms-1" size={20} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders Box */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
                            <Button
                                onClick={() => push('/customer/orders')}
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                View <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {quotData?.orders?.map((item, index) => (
                                <div
                                    key={index}
                                    className=" text-gray-700 border-b pb-2  text-sm"
                                >
                                    <div className="max-xl:flex items-center gap-2  xl:hidden">
                                        <strong>Order:</strong>
                                        <div className="">
                                            <QuotationGenerator id={item?._id} quoteId={item?.orderNo} />
                                        </div>
                                    </div>
                                    <div className='flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2'>
                                        <div className="text-xs text-gray-500">{moment(item?.createdTS || item?.createdAt).format('lll')}</div>

                                        <div className=" xl:flex items-center gap-2 break-words max-xl:hidden">
                                            <strong>Order:</strong>
                                            <div className="">
                                                <QuotationGenerator id={item?._id} quoteId={item?.orderNo} />
                                            </div>
                                        </div>

                                        <div className="font-bold text-green-600 whitespace-nowrap">${item?.totalAmount}</div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <FavoriteProduct />
        </div>
    )
}

export default CustomerDashboard