'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import toast from 'react-hot-toast';
import { handleError } from '@/lib/api/errorHandler';
import { useEffect, useState } from 'react';
import { pdf, } from '@react-pdf/renderer';
import { QuoteDetailForm } from './quote-detail-from';
import { setQuoteData } from '@/lib/redux/products';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerOverlay from '../ui/spinnerOverlay';
import { DownOutlined, } from '@ant-design/icons';
import { Dropdown, Space, } from 'antd';
import { CustomerAddresses } from '../quote/customerAddress';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import moment from 'moment';
import { PaymentAdminCard } from './payment-admin-card';
import dynamic from "next/dynamic";
const QuotationGenerator = dynamic(() => import("./quote-pdf"), { ssr: false });
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QuotationPDFTemplate from './quote-pdf-template';

const quoteUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'closed', 'completed']),
  totalAmount: z.number().min(0),
  leadTime: z.string().min(0),
  notes: z.string().optional(),
});

const QuoteDetailsPage = () => {
  const { id: quoteId } = useParams()
  const { get, put, header2 } = ApiFunction()
  const dispatch = useDispatch()
  const { back } = useRouter()
  const quote = useSelector(state => state.prod.quoteData)

  const searchParams = useSearchParams()
  const quoteParams = new URLSearchParams(searchParams)
  const quoteType = quoteParams.get('quote')
  const orderNo = quoteParams.get('orderNo')
  const quoteNo = quoteParams.get('quoteNo')

  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(quoteUpdateSchema),
    defaultValues: {
      status: quote?.status,
      totalAmount: quote?.totalAmount,
      // pricing: quote?.pricing || { subtotal: 0, tax: 0, total: 0 },
      leadTime: quote?.leadTime || '',
      notes: quote?.notes || '',
    },
  });
  const handleUpdateStatus = async (data, reason) => {
    // In a real app, this would update the quote in the backend
    setIsLoading(true)
    await put(`quotation/status/${quote?._id}`, { status: data, closedReason: reason, type: quote?.type })
      .then(async (result) => {
        if (result.success) {
          toast.success(result.message)
          // dispatch(setQuoteData(result?.data))
          if (data === 'approved') {
            const blob = await pdf(<QuotationPDFTemplate quotationData={result?.data} />).toBlob();

            const formData = new FormData();
            formData.append('pdf', blob, 'quotation.pdf');

            await put(`quotation/resend/${quote?._id}/approved`, formData, { headers: header2 })
          }
          back()
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => setIsLoading(false))
  };
  const handleGetQuote = async () => {
    setIsLoading(true)
    await get(`quotation/byId/${quoteId}`)
      .then((result) => {
        if (result.success) {
          dispatch(setQuoteData(result?.data))

        } else {
          dispatch(setQuoteData(null))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }
  useEffect(() => {
    handleGetQuote()

    return () => {
      dispatch(setQuoteData(null))
    }
  }, [])
  const items = [
    {
      label: 'Open Order',
      key: '1',
    },
    {
      label: 'Close Quote',
      key: '2',
    },
    {
      label: 'Lost Order',
      key: '3',
    }
  ];
  const handleMenuClick = e => {
    handleUpdateStatus(e?.key === '1' ? "approved" : 'closed', items.find(i => i.key === e?.key).label)
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <>
      {(isLoading) && <SpinnerOverlay />}
      <p className='mb-3'> {quoteType === 'sales' ? 'Sales Order' : 'Quote'} / {quoteType === 'sales' ? quote?.orderNo || '' : quote?.quoteNo || ''} </p>
      {quoteParams.get('q') === 'cart' ?
        <>
          <div className='flex justify-end gap-3 my-3'>
            {quote?.status === 'pending' && <Button disabled={!quote?.quote?.length > 0} onClick={() => handleUpdateStatus('approved')} size='md' >Approve</Button>}
            {quote?.status === 'approved' && <Button disabled={!quote?.quote?.length > 0} onClick={() => handleUpdateStatus('completed')} size='md' >Complete</Button>}
            <QuotationGenerator type={quoteType} id={quoteId} resend={true} />
          </div>
          <QuoteDetailForm />
          <div className='my-3'>
            {quoteType === 'sales' ?
              <div className='gap-3 flex'>
                {quote?.status === 'pending' && <Button disabled={!quote?.quote?.length > 0} onClick={() => handleUpdateStatus('approved')} size='md' >Approve</Button>}
                {quote?.status === 'pending' && <Button className='bg-red-600 text-white hover:bg-red-700' disabled={!quote?.quote?.length > 0} onClick={() => handleUpdateStatus('rejected')} size='md' >Reject</Button>}
                {quote?.status === 'approved' && <Button disabled={!quote?.quote?.length > 0} onClick={() => handleUpdateStatus('completed')} size='md' >Complete</Button>}
              </div> :

              <Dropdown disabled={!quote?.quote?.length > 0} menu={menuProps}>
                <Button>
                  <Space>
                    Close Quote
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>}
          </div>
        </> :
        quoteParams.get('q') === 'customer' ?
          <>
            <CustomerAddresses rowData={quote?.user} />
          </> :
          quoteParams.get('q') === "payment" ?
            <>
              <PaymentAdminCard />
            </> :
            quoteParams.get('q') === "state-change" && <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow >
                  <TableHead>Type</TableHead>
                  <TableHead>State From</TableHead>
                  <TableHead>State To </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <tbody className="divide-y divide-gray-200">
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell className="capitalize" >{quote?.user?.oldWebState}</TableCell>
                  <TableCell className="capitalize" >{quote?.user?.currentWebState}</TableCell>
                  <TableCell className="" > <Link className='underline text-blue-700 font-medium' href={`/dashboard/customers/edit/${quote?.user?._id}`}> {quote?.user?.email}</Link></TableCell>
                  <TableCell className="" >{moment(quote?.user?.stateChangeDate).format('lll')}</TableCell>
                </TableRow>
              </tbody>
            </Table>}
    </>
  );
}

export default QuoteDetailsPage