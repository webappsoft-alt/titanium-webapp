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
import { Plus } from 'lucide-react';
import { UserFilterForm } from '@/components/admin/filter-dialog';
import moment from 'moment';
import ImportTitaniumUser from '@/lib/utils/importTitaniumUser';
import Link from 'next/link';

const columnHelper = createColumnHelper();


export function AdminTitaniumPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, put } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [isAccpectLoading, setIsAccpectLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const handleUserList = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`users/customer/${pageNo}/all?type=sub-admin`, { ...filterData })
      .then((result) => {
        if (result.success) {
          setUserList(result.users)
        } else {
          setUserList([])
        }
        setCount(result.count.totalPage)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    handleUserList(lastId)
  }, [lastId, filterData]);

  const handleAcceptCustomer = (id, status) => {
    setIsAccpectLoading(true)
    put(`users/change/${status}/${id}`)
      .then((result) => {
        if (result.success) {
          handleUserList()
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
        const { email, _id } = info.row.original; // Access the original row data
        return <Link className='underline text-blue-700 font-medium' href={`/dashboard/titanium/user/edit/${_id}`} > {email}</Link>
      },
    }),
    columnHelper.display({
      id: 'branch', // A unique ID for this column
      header: 'Branch',
      cell: (info) => {
        const { branch } = info.row.original; // Access the original row data
        return branch?.length > 0 ? branch?.map(item => item?.code)?.join(', ') : []
      },
    }),
    columnHelper.display({
      id: 'routing', // A unique ID for this column
      header: 'Routing',
      cell: (info) => {
        const { routing } = info.row.original; // Access the original row data
        return routing?.length > 0 ? routing?.map(item => item?.code)?.join(', ') : []
      },
    }),
    columnHelper.display({
      id: 'roles', // A unique ID for this column
      header: 'Roles',
      cell: (info) => {
        const { roles } = info.row.original; // Access the original row data
        return roles?.length > 0 ? roles?.map(item => item)?.join(', ') : []
      },
    }),
    columnHelper.display({
      id: 'status', // A unique ID for this column
      header: 'Status',
      cell: (info) => {
        const { status } = info.row.original; // Access the original row data
        const isActive = status.toLowerCase() === 'active'; // Determine if status is active

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${isActive
              ? 'bg-green-100 text-green-800' // Styles for active status
              : 'bg-red-100 text-red-800' // Styles for inactive status
              }`}
          >
            {isActive ? 'Active' : status === 'deactivated' ? 'Deactivated' : 'Inactive'}
          </span>
        );
      },
    }),
    // columnHelper.accessor('lastQuote', {
    //   header: 'Last Quote',
    //   cell: (info) => format(info.getValue(), 'MMM d, yyyy'),
    // }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        const { status } = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant={status === 'active' ? "secondary" : 'ghost'}
              size="sm"
              disabled={isAccpectLoading}
              onClick={() => handleAcceptCustomer(row?.original?._id, status === 'active' ? 'deactivated' : 'active')}
            >
              {status === 'active' ? isAccpectLoading ? 'Deactivated....' : 'Deactivate' : isAccpectLoading ? 'Accpet....' : 'Accept'}
            </Button>
          </div>
        )
      },
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Titanium User Management</h1>
        <p className="text-gray-600">View and manage Titanium User information</p>
      </div>
      <div className='flex gap-3 justify-end'>
        <Link className='' href={'/dashboard/titanium/user/add'}> <Button size='sm' ><Plus size={15} className='me-2' /> New Titanium User </Button> </Link>
        {/* <Button size='sm' onClick={() => setIsOpen(true)} variant='outline'> <Filter size={15} className='me-2' /> Filter </Button> */}
      </div>

      <UserFilterForm isTitanium={true} onClose={() => setIsOpen(!isOpen)} isOpen={isOpen} setFilterData={setFilterData} />
      {/* {filterData && <Button size='sm' onClick={() => {
          setIsOpen(false)
          setFilterData(null)
        }} variant='outline'>  Reset All </Button>} */}
      <div className='flex justify-end'>
        <ImportTitaniumUser handleGetUser={handleUserList} />
      </div>
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={userList} loading={isLoading} setLastId={setLastId} count={count} lastId={lastId} />
        </div>
      </div>
      {/* {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )} */}
    </div>
  );
}