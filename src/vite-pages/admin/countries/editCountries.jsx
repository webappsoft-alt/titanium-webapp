'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { CountriesForm } from './countriesForm';
import { useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';

const EditCountriesData = () => {
    const [country, setCountry] = useState();
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)
    useEffect(() => {
        const paramsData = params.get('query')
        if (paramsData) {
            setCountry(JSON.parse(paramsData))
        }
    }, []);
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Edit Countries</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/competitor">Countries</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#" >{country?.code} </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <CountriesForm rowData={country} />
        </>
    )
}
const EditCountries = () => {
    return (<Suspense fallback={<Loading />}>
        <EditCountriesData />
    </Suspense>)
}
export default EditCountries