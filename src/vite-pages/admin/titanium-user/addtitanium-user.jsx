'use client'
import React from 'react'
import { TitaniumUserForm } from './titanium-userForm'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const AddUserTitanium = () => {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Add Titanium User</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/titanium/user">User</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href='#'>New Titanium User</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <TitaniumUserForm />
        </>
    )
}

export default AddUserTitanium