'use client'
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { CompetitorDomainForm } from './competitor-domainForm'

const AddCompetitorDomain = () => {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Add Competitor Domain</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/competitor">Competitor</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">New Competitor Domain</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <CompetitorDomainForm />
        </>
    )
}

export default AddCompetitorDomain