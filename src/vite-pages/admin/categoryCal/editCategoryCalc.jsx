'use client'
import Loading from '@/app/loading';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CategoryCalForm from './categoryCalForm';


const EditCategory = () => {
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
                <h1 className="text-2xl font-bold">Edit Category Information</h1>
            </div>
            <div className='mb-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/category-management">Category Information</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <CategoryCalForm rowData={tolData} />
        </>
    )
}

const EditCategoryAdmin = () => {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <EditCategory />
            </Suspense>
        </>
    )
}


export default EditCategoryAdmin