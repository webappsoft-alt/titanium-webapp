'use client'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { TerritoriesForm } from './territoriesForm';
import { useParams, useSearchParams } from 'next/navigation';

const EditTerritories = () => {
    const [territories, setTerritorieData] = useState();
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    useEffect(() => {
        const paramsData = params.get('query')
        if (paramsData) {
            setTerritorieData(JSON.parse(paramsData))
        }
    }, []);
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Edit Territories</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/competitor">Territories</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">{territories?.code} </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <TerritoriesForm rowData={territories} />
        </>
    )
}

export default EditTerritories