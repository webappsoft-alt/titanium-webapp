'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import toast from 'react-hot-toast';
import { DTable } from '@/components/admin/dTable';
import { Eye } from 'lucide-react';
import moment from 'moment';
import { CustomerSupportDetailsDialog } from '@/components/admin/support-details-dialog';

const columnHelper = createColumnHelper();

export function AdminCustomersSupport() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, put } = ApiFunction()
  const [isLoading, setIsLoading] = useState(true);
  const [isAccpectLoading, setIsAccpectLoading] = useState(false);
  const [supportList, setSupportList] = useState([]);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);

  const handleSupportList = async (pageNo) => {
    setIsLoading(true)
    await get(`support/admin/${pageNo}`)
      .then((result) => {
        if (result.success) {
          setSupportList(result.support)
        } else {
          setSupportList([])
        }
        setCount(result.count.totalPage)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    handleSupportList(lastId)
  }, [lastId]);
  const handleAttend = (id) => {
    setIsAccpectLoading(true)
    put(`support/attended/${id}`)
      .then((result) => {
        if (result.success) {
          handleSupportList()
          toast.success(result.message)
        }
      }).catch((err) => {
        handleError(err)
      }).finally(() => {
        setIsAccpectLoading(false)
      })
  }
  const columns = [
    columnHelper.display({
      id: 'createdAt', // A unique ID for this column
      header: 'CreatedAt',
      cell: (info) => {
        const { createdAt } = info.row.original; // Access the original row data
        return moment(createdAt).format('lll')
      },
    }),
    columnHelper.display({
      id: 'email', // A unique ID for this column
      header: 'Email',
      cell: (info) => {
        const { email, _id } = info.row.original; // Access the original row data
        return email
      },
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('msg', {
      header: 'Message',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.display({
      id: 'attended', // A unique ID for this column
      header: 'Attended',
      cell: (info) => {
        const { attended } = info.row.original; // Access the original row data
        const isActive = attended; // Determine if status is active

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${isActive
              ? 'bg-green-100 text-green-800' // Styles for active status
              : 'bg-red-100 text-red-800' // Styles for inactive status
              }`}
          >
            {isActive ? 'Attended' : 'Not Attended'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Detail',
      cell: ({ row }) => {
        const { attended, _id } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <Button
              variant={'outline'}
              size="sm"
              onClick={() => setSelectedCustomer(row.original)}
            >
              <Eye size={15} />
            </Button>
            {!attended &&
              <Button
                variant={'primary'}
                size="sm"
                disabled={isAccpectLoading}
                onClick={() => handleAttend(row?.original?._id)}
              >
                Attend
              </Button>}
          </div>
        )
      },
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Support</h1>
        <p className="text-gray-600">View and manage customer support information</p>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={supportList} loading={isLoading} setLastId={setLastId} lastId={lastId} count={count} />
        </div>
      </div>
      {selectedCustomer && (
        <CustomerSupportDetailsDialog
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}