'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { CompetitorDomainForm } from './competitor-domainForm';
import { useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';

const EditCompetitor = () => {
    const [competitor, setCompetitor] = useState();
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)
    useEffect(() => {
        const paramsData = params.get('query')
        if (paramsData) {
            setCompetitor(JSON.parse(paramsData))
        }
    }, []);
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Edit Competitor Domain</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/competitor">Competitor</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">{competitor?.domain} </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <CompetitorDomainForm rowData={competitor} />
        </>
    )
}

const EditCompetitorDomain = () => {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <EditCompetitor />
            </Suspense>
        </>
    )
}

export default EditCompetitorDomain