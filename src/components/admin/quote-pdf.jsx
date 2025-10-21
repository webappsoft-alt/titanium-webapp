'use client'
// QuotationPDF.js
import React, { useEffect, useState } from 'react';
import { pdf, } from '@react-pdf/renderer';
import { FileText, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import { Spinner } from '../ui/spinner';
import toast from 'react-hot-toast';
import dynamic from "next/dynamic";
import QuotationPDFTemplate from './quote-pdf-template';
// const QuotationPDFTemplate = dynamic(() => import("./quote-pdf-template"), { ssr: false });

const QuotationGenerator = ({ quotationData, id, quoteId, tab, resend, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { get, put, header2 } = ApiFunction()
  const handleGetQuote = async () => {
    setIsLoading(true)
    await get(`quotation/byId/${id}`)
      .then((result) => {
        const pdfBlob = pdf(<QuotationPDFTemplate quotationData={result?.data} />).toBlob();
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
        const blob = await pdf(<QuotationPDFTemplate quotationData={result?.data} />).toBlob();

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
              onClick={() => {
                const pdfBlob = pdf(<QuotationPDFTemplate quotationData={quotationData} />).toBlob();
                pdfBlob.then(blob => {
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                });
              }}>
              <FileText size={15} />
            </Button>}
        </div> : <>
        <button
          onClick={() => {
            const pdfBlob = pdf(<QuotationPDFTemplate quotationData={quotationData} />).toBlob();
            pdfBlob.then(blob => {
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            });
          }}
          className={`w-full flex items-center justify-between text-start px-4 py-3 rounded-md text-sm font-medium transition text-gray-600 hover:bg-gray-50`}
        >
          <div className="flex items-center space-x-3">
            <tab.icon className="h-4 w-4" />
            <span className="line-clamp-1 text-sm">{tab?.name}</span>
          </div>
        </button>
      </>
  );
};

export default QuotationGenerator;