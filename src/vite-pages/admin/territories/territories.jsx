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
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

const columnHelper = createColumnHelper();

export function AdminTerritoriesPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, put, deleteData } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [isAccpectLoading, setIsAccpectLoading] = useState('');
  const [territoriesList, setTerritoriesList] = useState([]);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);

  const handleGet = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`territories/admin/${pageNo}`)
      .then((result) => {
        if (result.success) {
          setTerritoriesList(result.territories)
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
    deleteData(`territories/${id}`)
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

    columnHelper.accessor('code', {
      header: 'Branch',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Link href={`/dashboard/territories/edit/${row.original?._id}?query=${JSON.stringify(row.original)}`}>
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
        <h1 className="text-2xl font-bold">Territories Management</h1>
        <p className="text-gray-600">View and manage Territories information</p>
      </div>
      <div className='flex justify-end'>
        <Link className='' href={'/dashboard/territories/add'}> <Button size='sm' ><Plus size={15} className='me-2' /> New Territories </Button> </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={territoriesList} loading={isLoading} setLastId={setLastId} lastId={lastId} count={count} />
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