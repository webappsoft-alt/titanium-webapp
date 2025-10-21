'use client'
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

const TitaniumServicesPage = () => {
    return (
        <div className="container py-8 max-md:p-3">
            {/* Header Banner */}
            <div className="w-full bg-gray-800 px-5 py-5 text-white relative rounded-xl">
                <h1 className="text-blue-400 text-xl font-semibold mb-0">Titanium Industries <span className='text-white '>|  Our Services</span> </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 my-6 px-4">
                <Link href={'/contact'}>
                    <Button >
                        Contact Us
                    </Button>
                </Link>
                <Link href={'/customer/quick-quote'}>
                    <Button >
                        Create Quote
                    </Button>
                </Link>
                <Link href={'/tools/calculator'}>
                    <Button >
                        Weight Calculator
                    </Button>
                </Link>
            </div>

            <div className="max-w-6xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stocking Programs */}
                    <div className="border-t-2 border-gray-200 pt-2">
                        <h2 className="text-blue-800 font-medium mb-3">Stocking Programs</h2>
                        <div className="mb-4">
                            <img
                                src="https://titanium.com/wp-content/uploads/2019/01/FOTO_Inventory07-clr01a_PG2-1030x687.png"
                                alt="Titanium stocking warehouse with metal bars"
                                className="w-full h-full max-h-80 object-cover object-center mb-3"
                            />
                            <p className="text-sm text-gray-700">
                                Titanium Industries offers a wide variety of services with the objective of
                                reducing costs and cycle time for manufacturing customers. For information
                                regarding stocking programs and other services please contact us today.
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="font-medium text-blue-700">Just-In-Time / Kanban Programs</p>
                            <div className="mt-4">
                                <img
                                    src="https://titanium.com/wp-content/uploads/2020/02/20190822_135411-1030x579.jpg"
                                    alt="Titanium bars on warehouse shelves"
                                    className="w-full h-full max-h-80 object-cover object-center mb-3"
                                />
                                <p className="text-sm text-gray-700">
                                    We deliver product Just-In-Time at the place and times as required from
                                    our global warehouse.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kitting Services */}
                    <div className="border-t-2 border-gray-200 pt-2">
                        <h2 className="text-blue-800 font-medium mb-3">Kitting Services</h2>
                        <div className="mb-4">
                            <img
                                src="https://titanium.com/wp-content/uploads/2019/01/FOTO_Inventory07-clr01a_PG2-1030x687.png"
                                alt="Titanium cylinders arranged in rows"
                                className="w-full h-full max-h-80 object-cover object-center mb-3"
                            />
                            <p className="text-sm text-gray-700">
                                Titanium Industries provides kitting services where individually separate
                                material items are grouped, packed, and shipped together as one
                                package. Ordering kitted parts to meet a work package, statement of
                                work, or job set requirement helps save money by decreasing demand
                                and by reducing transaction costs and freight charges. For
                                further service information please contact us today.
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="font-medium text-blue-700">Bonded Warehouse</p>
                            <div className="mt-4">
                                <img
                                    src="https://titanium.com/wp-content/uploads/2020/02/20190822_135411-1030x579.jpg"
                                    alt="Metal tubes in warehouse storage"
                                    className="w-full h-full max-h-80 object-cover object-center mb-3"
                                />
                                <p className="text-sm text-gray-700">
                                    Our bonded warehouse is an effective cost saving strategy and provides
                                    supply chain flexibility. Providing supply chain optimization is a secure
                                    logistics environment that includes accurate material inventory,
                                    import compliance services, and an inventory system that conforms to
                                    U.S. Customs 19 CFR 19.12 for inventory control and accounting.
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    Titanium Industries offers this warehousing service for the of most
                                    metals, as well as other durable goods. Strategically located to service
                                    the global marketplace.
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    For information about using our T.I. bonded warehouse space, please
                                    contact us today.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Toll Processing */}
                    <div className="border-t-2 border-gray-200 pt-2 mt-6">
                        <h2 className="text-blue-800 font-medium mb-3">Toll Processing</h2>
                        <div className="mb-4">
                            <img
                                src="https://titanium.com/wp-content/uploads/2019/10/shipping-mark-2-1-1030x591.jpg"
                                alt="Metal cylinders in processing area"
                                className="w-full h-full max-h-80 object-cover object-center mb-3"
                            />
                            <p className="text-sm text-gray-700">
                                As a manufacturing producer and global distributor of metal products,
                                Titanium Industries has maximized the value of vendor relationships and
                                internal capabilities. These relationships enable us to cost
                                materials produced to many standard specifications for various
                                industries including aerospace and industrial.
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                                Turn your scrap metal bulk materials and other scrap materials into a
                                value-added product by leveraging our size. Maximize the value of your
                                material purchases, and increase your organization's overall profitability
                                and competitiveness position.
                            </p>
                        </div>
                    </div>

                    {/* Scrap Reclamation */}
                    <div className="border-t-2 border-gray-200 pt-2 mt-6">
                        <h2 className="text-blue-800 font-medium mb-3">Scrap Reclamation</h2>
                        <div className="mb-4">
                            <img
                                src="https://titanium.com/wp-content/uploads/2019/01/shutterstock_529475002-1-1030x687.jpg"
                                alt="Metal scrap materials"
                                className="w-full h-full max-h-80 object-cover object-center mb-3"
                            />
                            <p className="text-sm text-gray-700">
                                Titanium Industries can offer a competitive return on investment for
                                segregated scrap materials. As a distributor of titanium and specialty
                                metals, Titanium Industries recognizes the value of these materials and yield
                                competitive offers for segregated scrap materials.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitaniumServicesPage;