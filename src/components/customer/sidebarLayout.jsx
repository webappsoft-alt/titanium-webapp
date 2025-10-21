'use client'
import React, { useState } from 'react'
import { QuickQuoteSidebar } from '../quote/quick-quote-sidebar'
import { CustomerMobileSidebar } from './mobileSidebar'
import { Menu } from 'lucide-react';

const CustomerSidebarLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="min-h-screen">
                <div className='flex'>
                    <QuickQuoteSidebar />
                    <div className="container py-8 max-md:p-3">
                        <div className="lg:hidden mb-3 relative">
                            <button
                                className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <span>{"Menu"}</span>
                                <Menu className="h-5 w-5" />
                            </button>

                        </div>
                        <main className="rounded-lg w-full">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
            <CustomerMobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    )
}

export default CustomerSidebarLayout