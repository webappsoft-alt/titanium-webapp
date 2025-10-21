'use client'
import React from 'react'
import StaticPageForm from "./staticPageForm";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const pageContentArray = [
    { value: 'terms-condition', label: 'Terms & Condition' },
    { value: 'faqs', label: 'FAQs Content' },
]
const StaticPage = () => {
    const { back } = useRouter()
    const pathname = usePathname()
    return (
        <>
            <Button onClick={() => back()} size='sm'> <ArrowLeft size={15} /> </Button>
            <div className="space-y-6 mt-2">
                <div>
                    <h1 className="text-2xl font-bold">Add {pageContentArray?.find(item => pathname.endsWith(item?.value))?.label}</h1>
                    <p className="text-gray-600">Review and manage {pageContentArray?.find(item => pathname.endsWith(item?.value))?.label}</p>
                </div>
                <StaticPageForm />
            </div>
        </>
    )
}

export default StaticPage