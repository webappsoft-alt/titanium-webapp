'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ApiFunction from '@/lib/api/apiFuntions'
import moment from 'moment'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const UserActivity = ({ tableData = [] }) => {
    const { id } = useParams()
    const { get } = ApiFunction()
    const [quoteData, setQuoteData] = useState({ sales: [], openQuote: [], closedQuote: [] });
    const handleGetQuote = async () => {
        await get(`/quotation/byUserId/${id}`)
            .then((result) => {
                const salesData = result?.data?.filter(item => (["approved", "completed"].includes(item?.status)))
                const openQuoteData = result?.data?.filter(item => (["pending"].includes(item?.status)))
                const closeQuoteData = result?.data?.filter(item => (["closed"].includes(item?.status)))
                setQuoteData({
                    sales: salesData,
                    openQuote: openQuoteData,
                    closedQuote: closeQuoteData,
                })
            }).catch((err) => {
                console.log(err)
            });
    }
    useEffect(() => {
        handleGetQuote()
    }, []);
    return (
        <div className='space-y-4 pt-4'>
            <div>
                <h2 className='text-xl font-semibold '>Sales Order</h2>
                <Table>
                    <TableHeader>
                        <TableHead>Sales Order Created</TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Order Total</TableHead>
                    </TableHeader>
                    {quoteData?.sales.map((item, index) => (
                        <TableBody key={index}>
                            <TableRow>
                                <TableCell className="border-b border-t" >{moment(item?.createdAt).format('lll')} </TableCell>
                                <TableCell className="border-b border-t" >{item?.quoteNo} </TableCell>
                                <TableCell className="border-b border-t" >${item?.totalAmount} </TableCell>
                            </TableRow>
                        </TableBody>))}
                </Table>
            </div>
            <div>
                <h2 className='text-xl font-semibold '>Open Quote</h2>
                <Table>
                    <TableHeader>
                        <TableHead>Quote Created</TableHead>
                        <TableHead>Quote Updated</TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Order Total</TableHead>
                    </TableHeader>
                    {quoteData?.openQuote.map((item, index) => (
                        <TableBody key={index}>
                            <TableRow>
                                <TableCell className="border-b border-t" >{moment(item?.createdAt).format('lll')} </TableCell>
                                <TableCell className="border-b border-t" >{moment(item?.updatedAt).format('lll')} </TableCell>
                                <TableCell className="border-b border-t" >{item?.quoteNo} </TableCell>
                                <TableCell className="border-b border-t" >${item?.totalAmount} </TableCell>
                            </TableRow>
                        </TableBody>))}
                </Table>
            </div>
            <div>
                <h2 className='text-xl font-semibold '>Closed Orders</h2>
                <Table>
                    <TableHeader>
                        <TableHead>Quote Created</TableHead>
                        <TableHead>Quote Updated</TableHead>
                        <TableHead>Order Total</TableHead>
                        <TableHead>Reason</TableHead>
                    </TableHeader>
                    {quoteData?.closedQuote.map((item, index) => (
                        <TableBody key={index}>
                            <TableRow>
                                <TableCell className="border-b border-t" >{moment(item?.createdAt).format('lll')} </TableCell>
                                <TableCell className="border-b border-t" >{moment(item?.updatedAt).format('lll')} </TableCell>
                                <TableCell className="border-b border-t" >${item?.totalAmount} </TableCell>
                                <TableCell className="border-b border-t" > </TableCell>
                            </TableRow>
                        </TableBody>))}
                </Table>
            </div>
        </div>
    )
}

export default UserActivity