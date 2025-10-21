'use client'
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ToleranceWeightForm } from './toleranceCalcForm'

const AddToleranceWeight = () => {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Add Tolerance Weight</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/territories">Tolerance Weight</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">New Tolerance Weight</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <ToleranceWeightForm />
        </>
    )
}

export default AddToleranceWeight