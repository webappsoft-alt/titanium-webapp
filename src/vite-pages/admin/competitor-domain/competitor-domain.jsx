'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CustomerDetailsDialog } from '@/components/admin/customer-details-dialog';
import ApiFunction from '@/lib/api/apiFuntions';
import debounce from 'debounce';
import { handleError } from '@/lib/api/errorHandler';
import toast from 'react-hot-toast';
import { DTable } from '@/components/admin/dTable';
import { Plus, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

const columnHelper = createColumnHelper();


export function AdminCompetitorPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, put,deleteData } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [isAccpectLoading, setIsAccpectLoading] = useState(false);
  const [domainList, setDomainList] = useState([]);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);

  const handleGet = debounce(async (pageNo = 1) => {
    setIsLoading(true)
    await get(`competitor/admin/${pageNo}`)
      .then((result) => {
        if (result.success) {
          setDomainList(result.domainData)
        }
        setCount(result.count.totalPage)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }, 300)
  useEffect(() => {
    handleGet(lastId)
  }, [lastId]);
  const handleAcceptCustomer = (id) => {
    setIsAccpectLoading(id)
    deleteData(`competitor/${id}`)
      .then((result) => {
        if (result.success) {
          handleGet()
          toast.success(result.message)
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsAccpectLoading('')
      })
  }
  const columns = [

    columnHelper.display({
      id: 'domain', // A unique ID for this column
      header: 'Domain',
      cell: (info) => {
        const { domain, _id } = info.row.original; // Access the original row data
        return <Link className='underline text-blue-700 font-medium' href={{ pathname: `/dashboard/competitor/edit/${_id}` , search:`query=${JSON.stringify(info.row.original)}`}} state={info.row.original}> {domain}</Link>
      },
    }),

    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button disabled={isAccpectLoading} variant="ghost" size="sm" onClick={() => handleAcceptCustomer(row.original?._id)}>
              {row.original?._id === isAccpectLoading ? <Spinner size='sm' /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        )
      },
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Competitor Domain Management</h1>
        <p className="text-gray-600">View and manage Competitor Domain information</p>
      </div>
      <div className='flex justify-end'>
        <Link className='' href={'/dashboard/competitor/add'}> <Button size='sm' ><Plus size={15} className='me-2' /> New Competitor Domain </Button> </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={domainList} loading={isLoading} setLastId={setLastId} lastId={lastId} count={count} />
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}