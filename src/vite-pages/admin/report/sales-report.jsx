'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { axiosInstance } from '@/lib/api/axiosInstance';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'

const SalesReport = () => {
    function getFirstDateOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    const [formData, setFormData] = useState({ startDate: moment(getFirstDateOfMonth()).format('YYYY-MM-DD'), endDate: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [statsData, setStatsData] = useState({ totalAmount: 0, incomplete: 0, complete: 0, _id: null });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleGetStats = useCallback(async () => {
        setIsLoading(true)
        await axiosInstance.get('quotation/stats', { params: formData })
            .then((result) => {
                setStatsData(result.data?.stats)
            }).catch((err) => {
                console.log(err)
            }).finally(() => setIsLoading(false))
    }, [formData])

    useEffect(() => {
        handleGetStats()
    }, []);
    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Sales Total</h1>
                    <p className="text-gray-600">View and manage sales report</p>
                </div>
                <div>
                    <div className='grid grid-cols-2 mb-3 gap-x-3 gap-y-3 max-sm:grid-cols-1'>
                        <div>
                            <Label htmlFor="startDate">Date created - from</Label>
                            <Input type='date' name="startDate" value={formData?.startDate} placeholder="Date created - from" onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="endDate">Date created - to</Label>
                            <Input type='date' name="endDate" value={formData?.endDate} placeholder="Date created - to" onChange={handleChange} />
                        </div>
                    </div>
                    <Button type="submit" onClick={handleGetStats} className='px-5' disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Search'}
                    </Button>
                </div>
            </div>
            <div className='mt-4'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Currency</TableHead>
                            <TableHead>Item Total</TableHead>
                            <TableHead>Adjustment Total</TableHead>
                            <TableHead>Sales Total</TableHead>
                            <TableHead>Complete Orders</TableHead>
                            <TableHead>Incomplete Orders</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>USD </TableCell>
                            <TableCell>${statsData?.totalAmount?.toFixed(2)} </TableCell>
                            <TableCell>$0.00 </TableCell>
                            <TableCell>${statsData?.totalAmount?.toFixed(2)} </TableCell>
                            <TableCell>{statsData?.complete} </TableCell>
                            <TableCell>{statsData?.incomplete} </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default SalesReport