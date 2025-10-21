'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CustomerDetailsDialog } from '@/components/admin/customer-details-dialog';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import toast from 'react-hot-toast';
import { DTable } from '@/components/admin/dTable';
import Link from "next/link";
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const columnHelper = createColumnHelper();

export function AdminToleranceCalPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, put, deleteData } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [isAccpectLoading, setIsAccpectLoading] = useState('');
  const [toleranceData, setToleranceData] = useState([]);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);

  const handleGet = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`tol-weigth/all/${pageNo}`)
      .then((result) => {
        if (result.success) {
          setToleranceData(result.data)
        }
        setCount(result.count.totalPage)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    handleGet(lastId)
  }, [lastId]);
  const handleAcceptCustomer = (id, status) => {
    setIsAccpectLoading(id)
    deleteData(`tol-weigth/${id}`)
      .then((result) => {
        if (result.success) {
          handleGet()
          toast.success(result.message)
          handleGet(lastId)
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsAccpectLoading('')
      })
  }
  const columns = [
    columnHelper.display({
      id: 'alloyFamily', // A unique ID for this column
      header: 'AlloyFamily',
      cell: (info) => {
        const { alloyFamily } = info.row.original; // Access the original row data
        return (alloyFamily?.length > 0 ? alloyFamily?.join(', ') : '')
      },
    }),
    columnHelper.display({
      id: 'alloyType', // A unique ID for this column
      header: 'AlloyType',
      cell: (info) => {
        const { alloyType } = info.row.original; // Access the original row data
        return (alloyType?.length > 0 ? alloyType?.join(', ') : '')
      },
    }),

    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor('unit', {
    //   header: 'Unit',
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Link href={{ pathname: `/dashboard/tolerance-weight/edit/${row.original?._id}`, search: `query=${JSON.stringify(row.original)}` }}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button disabled={isAccpectLoading} variant="ghost" size="sm" onClick={() => handleAcceptCustomer(row.original?._id)}>
            {row.original?._id === isAccpectLoading ? <Spinner size='sm' /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tolerance Weight Management</h1>
        <p className="text-gray-600">View and manage Tolerance Weight information</p>
      </div>
      <div className='flex justify-end'>
        <Link className='' href={'/dashboard/tolerance-weight/add'}> <Button size='sm' ><Plus size={15} className='me-2' /> New Tolerance Weight </Button> </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={toleranceData} loading={isLoading} setLastId={setLastId} lastId={lastId} count={count} />
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