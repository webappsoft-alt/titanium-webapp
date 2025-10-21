'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import ApiFunction from '@/lib/api/apiFuntions';
import { DTable } from '@/components/admin/dTable';
import ImportStatesExcel from '@/lib/utils/importStates';
import { useDispatch, useSelector } from 'react-redux';
import { setStatesList } from '@/lib/redux/products';

const columnHelper = createColumnHelper();

export function AdminStatesPage() {
  const { get, put, deleteData } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const statesList = useSelector(state => state.prod.statesList) || []
  const dispatch = useDispatch()

  const handleGet = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`states/`)
      .then((result) => {
        if (result.success) {
          dispatch(setStatesList(result.data))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    handleGet()
  }, []);

  const columns = [

    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('abbr', {
      header: 'Abbr',
      cell: (info) => info.getValue(),
    }),
    // columnHelper.display({
    //   id: 'actions',
    //   cell: ({ row }) => (
    //     <div className="flex justify-end gap-2">
    //       <Link href={{ pathname: `/dashboard/states/edit/${row.original?._id}`, search: `query=${JSON.stringify(row.original)}` }}>
    //         <Button variant="ghost" size="sm">
    //           <Edit className="h-4 w-4" />
    //         </Button>
    //       </Link>
    //     </div>
    //   ),
    // }),
  ];
  const itemsPerPage = 20;
  const paginatedData = statesList?.slice(
    (lastId - 1) * itemsPerPage,
    lastId * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">States Management</h1>
        <p className="text-gray-600">View and manage States information</p>
      </div>
      <div className='flex justify-end gap-2'>
        <ImportStatesExcel handleStates={handleGet} />
        {/* <Link className='' href={'/dashboard/states/add'}> <Button size='md' variant='ghost' ><Plus size={15} className='me-2' /> New Countries </Button> </Link> */}
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={paginatedData} loading={isLoading} setLastId={setLastId} lastId={lastId} count={Math.ceil(statesList?.length / itemsPerPage)} />
        </div>
      </div>
    </div>
  );
}