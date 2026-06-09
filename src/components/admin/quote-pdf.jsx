'use client'
// QuotationPDF.js
import React, { useState } from 'react';
import { pdf, } from '@react-pdf/renderer';
import { FileText, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import { Spinner } from '../ui/spinner';
import toast from 'react-hot-toast';
import dynamic from "next/dynamic";
import QuotationPDFTemplate from './quote-pdf-template';
// const QuotationPDFTemplate = dynamic(() => import("./quote-pdf-template"), { ssr: false });

const QuotationGenerator = ({ quotationData, id, quoteId, tab, resend, type, salesperson }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { get, put, header2 } = ApiFunction()
  const [salesData, setSalesData] = useState(salesperson ?? null);
  const handleGetQuote = async () => {
    setIsLoading(true)
    await get(`quotation/byId/${id}`)
      .then((result) => {
        const salespersonData = { accountManager: result?.data?.user?.accountManager ?? null, regionalManager: result?.data?.user?.regionalManager ?? null, salesRep: result?.data?.user?.salesRep ?? null, }
        const pdfBlob = pdf(<QuotationPDFTemplate quotationData={result?.data} salesperson={salespersonData} />).toBlob();
        pdfBlob.then(blob => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        });
      }).catch((err) => {

      }).finally(() => setIsLoading(false))
  }
  const sendQuotationEmail = async () => {
    setIsLoading(true)
    await get(`quotation/byId/${id}`)
      .then(async (result) => {
        const salespersonData = { accountManager: result?.data?.user?.accountManager ?? null, regionalManager: result?.data?.user?.regionalManager ?? null, salesRep: result?.data?.user?.salesRep ?? null, }
        const blob = await pdf(<QuotationPDFTemplate quotationData={result?.data} salesperson={salespersonData} />).toBlob();

        const formData = new FormData();
        formData.append('pdf', blob, 'quotation.pdf');

        await put(`quotation/resend/${id}/${type}`, formData, { headers: header2 })
          .then((result) => {
            if (result.success) {
              toast.success(result.message)
            }
          }).catch((err) => {
            handleError(err)
          })
      }).catch((err) => {

      }).finally(() => setIsLoading(false))
  }
  const fetchSalesDataIfNeeded = async () => {
    if (salesData) return salesData;
    const userId = quotationData?.user?._id || quotationData?.id;
    if (userId) {
      const response = await get(`quotation/admin/sales/${userId}`);
      setSalesData(response?.data);
      return response?.data;
    }
    return null;
  };

  const openPdf = async () => {
    setIsLoading(true);
    try {
      const currentSalesData = await fetchSalesDataIfNeeded();
      const blob = await pdf(<QuotationPDFTemplate quotationData={quotationData} salesperson={currentSalesData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    !tab ?
      resend ? <Button onClick={sendQuotationEmail} disabled={isLoading} variant='outline' size='md' > <Mail size={20} className='me-2' /> {isLoading ? <Spinner className="m-0" size='sm' /> : 'Resend'}</Button> :
        <div>
          {quoteId ?
            <Button
              variant='ghost'
              className='p-1 underline py-0'
              disabled={isLoading}
              onClick={handleGetQuote}>
              {isLoading ? <Spinner className="m-0" size='sm' /> : quoteId}
            </Button> :
            <Button
              variant='ghost'
              className='p-1'
              disabled={isLoading}
              onClick={openPdf}>
              {isLoading ? <Spinner className="m-0" size='sm' /> : <FileText size={15} />}
            </Button>}
        </div> : <>
        <button
          onClick={openPdf}
          disabled={isLoading}
          className={`w-full flex items-center justify-between text-start px-4 py-3 rounded-md text-sm font-medium transition text-gray-600 hover:bg-gray-50`}
        >
          <div className="flex items-center space-x-3">
            {isLoading ? <Spinner className="m-0" size='sm' /> : <tab.icon className="h-4 w-4" />}
            <span className="line-clamp-1 text-sm">{tab?.name}</span>
          </div>
        </button>
      </>
  );
};

export default QuotationGenerator;