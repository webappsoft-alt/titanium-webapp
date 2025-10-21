'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ToleranceWeightForm } from './toleranceCalcForm';
import { useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';

const EditTol = () => {
    const [tolData, setTolData] = useState();
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    useEffect(() => {
        const paramsData = params.get('query')
        if (paramsData) {
            setTolData(JSON.parse(paramsData))
        }
    }, []);
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Edit Tolerance Weight</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/competitor">Tolerance Weight</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <ToleranceWeightForm rowData={tolData} />
        </>
    )
}

const EditTolerance = () => {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <EditTol />
            </Suspense>
        </>
    )
}


export default EditTolerance