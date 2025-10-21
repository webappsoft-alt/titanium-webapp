'use client'
import React from 'react'
import { UserForm } from './userForm'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const AddUser = () => {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Add Customer</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/customers">User</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">New Customer</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <UserForm />
        </>
    )
}

export default AddUser