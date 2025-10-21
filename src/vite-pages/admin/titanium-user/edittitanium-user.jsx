'use client'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ApiFunction from '@/lib/api/apiFuntions';
import { TitaniumUserForm } from './titanium-userForm';
import { useParams } from 'next/navigation';

const EditUserTitanium = () => {
    const state = null;
    const [userData, setUserData] = useState();
    const { id } = useParams()
    const { get } = ApiFunction()
    const handleGetUser = async () => {
        await get(`users/byId/${id}`)
            .then((result) => {
                if (result.success) {
                    setUserData(result.user)
                }
            }).catch((err) => {
                console.log(err)
            });
    }
    useEffect(() => {
        if (state) {
            setUserData(state)
        } else {
            handleGetUser()
        }
    }, []);
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Edit Titanium User</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/titanium/user">User</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#" >{userData?.email} </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <TitaniumUserForm rowData={userData} />
        </>
    )
}

export default EditUserTitanium