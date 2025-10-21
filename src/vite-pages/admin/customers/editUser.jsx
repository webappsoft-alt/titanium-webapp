'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { UserForm } from './userForm'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ApiFunction from '@/lib/api/apiFuntions';
import SpinnerOverlay from '@/components/ui/spinnerOverlay';
import UserActivity from './userActivity';
import { UserAddresses } from './userAddresses';
import { setCustomerData } from '@/lib/redux/products';
import { useDispatch, useSelector } from 'react-redux';
import { UserChangePassword } from './userChangePassword';
import { useParams, useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';

const EditUserData = () => {
    const state = null;
    const rowData = useSelector(state => state.prod.customerData)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams()
    const { get, put } = ApiFunction()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const handleGetUser = async () => {
        setIsLoading(true)
        await get(`users/byId/${id}`)
            .then((result) => {
                if (result.success) {
                    dispatch(setCustomerData(result.user))
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        if (state) {
            dispatch(setCustomerData(state))
            setIsLoading(false)
        } else {
            handleGetUser()
        }
    }, []);
    if (isLoading) {
        return <SpinnerOverlay />
    }
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Edit Customer</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/customers">User</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">{rowData?.email} </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            {params.get('q') === 'activty' ? <UserActivity /> : params.get('q') === 'addresses' ? <UserAddresses rowData={rowData} /> : params.get('q') === 'password' ? <UserChangePassword /> : <UserForm rowData={rowData} />}
        </>
    )
}

const EditUser = () => {
    return (
        <>
            <Suspense fallback={<Loading />} >
                <EditUserData />
            </Suspense>
        </>
    )
}


export default EditUser