'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuoteDetailsDialog } from '@/components/admin/quote-details-dialog';
import ApiFunction from '@/lib/api/apiFuntions';
import { DTable } from '@/components/admin/dTable';
import { Edit } from 'lucide-react';
import { QuoteFilterForm } from '@/components/admin/filter-quote';
import { Spinner } from '@/components/ui/spinner';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from "next/dynamic";
const QuotationGenerator = dynamic(() => import("../../components/admin/quote-pdf"), { ssr: false });

const columnHelper = createColumnHelper();
function getStatusVariant(status) {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}
export function AdminQuotesPage() {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const { get } = ApiFunction()
  const { push, replace } = useRouter()
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [initialLoader, setInitialLoader] = useState(false);
  const [quotationData, setQuotationData] = useState([]);
  const pathname = usePathname()

  const salesQuote = pathname.endsWith('/sales-order') ? 'sales' : ''
  const status = pathname.endsWith('/close-quotes') ? 'closed' : ''
  const type = pathname.endsWith('/open-quotes') ? 'open-quote' : ''
  const detailPagePage = salesQuote ? 'sales-order' : status ? 'close-quotes' : type ? 'open-quotes' : ''
  const [lastId, setLastId] = useState(1);
  const handleGet = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`quotation/admin/${pageNo}`, { type, status, ...formData, quote: salesQuote ? salesQuote : status ? status : type })
      .then((result) => {
        if (result.success) {
          setQuotationData(result.quotations)
          setCount(result.count.totalPage)
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }
  useEffect(() => {
    setFormData({})
    setCount(0)
    setLastId(1)
    setInitialLoader(true)
    const timer = setTimeout(() => {
      setInitialLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);
  useEffect(() => {
    handleGet(lastId)
  }, [pathname, formData, lastId]);
  const handleViewQuote = (row) => {
    setSelectedQuote(row)
  }
  const columns = [
    columnHelper.display({
      id: 'Quote Date',
      header: 'Quote Date',
      cell: (info) => {
        const { createdAt, } = info.row.original
        return <span className='whitespace-nowrap text-xs'>{format(info.row.original?.createdTS || createdAt, 'MMM d, yyyy')}</span>
      },
    }),
    columnHelper.display({
      id: 'State',
      header: 'State',
      cell: (info) => {
        const { user } = info.row.original
        return <span className='capitalize text-xs'>{user?.currentWebState}</span>
      },
    }),
    salesQuote === 'sales' ?
      columnHelper.accessor('orderNo', {
        header: 'Order ID',
        cell: (info) => info.getValue(),
      }) :
      columnHelper.accessor('quoteNo', {
        header: 'Quote ID',
        cell: (info) => info.getValue(),
      }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'Location', // A unique ID for this column
      header: 'Location',
      cell: (info) => {
        const { state, country } = info.row.original; // Access the original row data
        const { state: stateUser, country: countryUser } = info.row.original?.user; // Access the original row data
        return `${state || stateUser || ''}${(stateUser || state) && ',' || '---'} ${country || countryUser || ''}`.trim() || '-'; // Combine and handle missing values
      },
    }),
    columnHelper.display({
      id: 'name', // A unique ID for this column
      header: 'Name',
      cell: (info) => {
        const { fname, lname } = info.row.original; // Access the original row data
        return `${fname || ''} ${lname || ''}`.trim() || '-'; // Combine and handle missing values
      },
    }),
    columnHelper.display({
      id: 'email', // A unique ID for this column
      header: 'Email',
      cell: (info) => {
        const { email, _id } = info.row.original?.user; // Access the original row data
        return <Link className='underline text-blue-700 font-medium' href={`/dashboard/customers/edit/${_id}`}> {email} </Link>
      },
    }),
    columnHelper.display({
      id: 'totalAmount', // A unique ID for this column
      header: 'Total Amount',
      cell: (info) => {
        const { totalAmount } = info.row.original; // Access the original row data
        return `$${Number(totalAmount).toFixed(2)}`; // Combine and handle missing values
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={getStatusVariant(info.getValue())}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'View',
      header: 'View',
      cell: ({ row }) => (
        <div className="flex justify-center items-center ">
          <QuotationGenerator quotationData={row.original} />
          {(type || pathname.endsWith('/sales-order')) &&
            <Button
              variant="ghost"
              size="sm"
              onClick={() => push(`/dashboard/${detailPagePage}/${row.original?._id}?quote=${salesQuote ? salesQuote : status ? status : type}&${salesQuote === 'sales' ? `orderNo=${row.original?.orderNo}` : `quoteNo=${row.original?.quoteNo}`}&q=cart`)}
            >
              <Edit size={15} />
            </Button>}
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{pathname.endsWith('/sales-order') ? 'Sales Order' : (type ? 'Open  Quote Management' : 'Close Quote Management')}</h1>
        <p className="text-gray-600">Review and manage customer quotes</p>
      </div>
      {initialLoader ? <div className="flex justify-center items-center py-8">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div> :
        <>
          <QuoteFilterForm isOrder={salesQuote === 'sales'} filterData={formData} setFilterData={setFormData} />
          <DTable columns={columns} loading={isLoading} products={quotationData} count={count} setLastId={setLastId} lastId={lastId} />

          {selectedQuote && (
            <QuoteDetailsDialog
              quote={selectedQuote}
              handleGet={() => handleGet()}
              onClose={() => setSelectedQuote(null)}
            />
          )}
        </>}
    </div>
  );
}