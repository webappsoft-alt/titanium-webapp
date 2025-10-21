'use client'
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { axiosInstance } from '@/lib/api/axiosInstance'
import exportToExcel from '@/lib/utils/exportCustomerExcel';
import moment from 'moment';
import React, { useCallback, useState } from 'react'

const CustomerReport = () => {
  const [isLoading, setIsLoading] = useState(false);


  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true)
    await axiosInstance.get(`users/customer/1/all`, { params: { isGenerateReport: true } })
      .then((result) => {
        if (result.data.success) {
          // Define the data
          const users = result.data.users
          const data = users.map(user => ({
            ID: user?._id,
            company: user?.company,
            stratixAccount: user?.stratixAccount,
            email: user?.email,
            full_name: `${user?.fname} ${user?.lname || ''}`,
            phone: user?.phone,
            competitor: user?.isCompetitor ? 'TRUE' : 'FALSE',
            industry: user?.industry,
            otherIndustry: user?.otherIndustry,
            country: user?.country,
            state: user?.state,
            createdAt: moment(user?.createdAt).format('lll'),
            updatedAt: moment(user?.updatedAt).format('lll'),
            status: user?.status === 'inactive' ? 'TRUE' : 'FALSE',
            login: user?.email,
            address: user?.address,
            city: user?.city,
            zipCode: user?.zipCode,
            discount: user?.discount,
            accountManager: user?.accountManager?.email || '',
            regionalManager: user?.regionalManager?.email || '',
            salesRep: user?.salesRep?.email || '',
            branch: user?.assignBranch?.code || '',
            termConditions: user?.isAcceptTerms ? 'TRUE' : 'FALSE',
            promotionEmails: user?.isAcceptSendOffers ? 'TRUE' : 'FALSE',
            taxLicense: user?.isTaxLicense ? 'TRUE' : 'FALSE',
          }));
          exportToExcel({ data: data, name: 'all_users' })
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }, [])
  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Report</h1>
          <p className="text-gray-600">View and manage customer report</p>
        </div>
        <Button type="submit" onClick={handleGenerateReport} className='px-5' disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Generate Customer Report'}
        </Button>
      </div>
    </>
  )
}

export default CustomerReport