'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { QuoteDetailsDialog } from '@/components/admin/quote-details-dialog';
import ApiFunction from '@/lib/api/apiFuntions';
import { DTable } from '@/components/admin/dTable';
import { QuoteFilterForm } from '@/components/admin/filter-quote';
import { usePathname } from 'next/navigation';
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

export function CustomerQuotesPage({ apiType = "" }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const { get } = ApiFunction()
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  const [quotationData, setQuotationData] = useState([]);
  const pathname  = usePathname()
  const [lastId, setLastId] = useState(1);
  const handleGet = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`quotation/user/${pageNo}`, { ...formData, stats: apiType })
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
    handleGet(lastId)
  }, [formData, lastId, pathname]);
  const handleViewQuote = (row) => {
    setSelectedQuote(row)
  }
  const columns = [
    columnHelper.display({
      id: `${apiType === 'orders' ? 'Orders' : 'Quote'} Date`,
      header: `${apiType === 'orders' ? 'Orders' : 'Quote'} Date`,
      cell: (info) => {
        const { createdAt } = info.row.original
        return <span className='whitespace-nowrap text-xs'>{format(createdAt, 'MMM d, yyyy')}</span>
      },
    }),
    apiType === 'orders' ?
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center items-center ">
          <QuotationGenerator quotationData={row.original} />
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold capitalize">{apiType ? (apiType) : "Quote"} </h2>
        <QuoteFilterForm isOrder={apiType === 'orders'} setFilterData={setFormData} isCustomer={true} />
        <DTable columns={columns} loading={isLoading} products={quotationData} count={count} setLastId={setLastId} lastId={lastId} />
      </div>

      {selectedQuote && (
        <QuoteDetailsDialog
          quote={selectedQuote}
          handleGet={() => handleGet()}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
}