'use client'
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import ApiFunction from '@/lib/api/apiFuntions';
import { DTable } from '@/components/admin/dTable';
import ImportCountryExcel from '@/lib/utils/importCountries';
import { useDispatch, useSelector } from 'react-redux';
import { setCountriesList } from '@/lib/redux/products';

const columnHelper = createColumnHelper();

export function AdminCountriesPage() {
  const { get, put, deleteData } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const countriesList = useSelector(state => state.prod.countriesList)||[]
  const dispatch = useDispatch()

  const handleGet = async (pageNo = 1) => {
    setIsLoading(true)
    await get(`countries/`)
      .then((result) => {
        if (result.success) {
          dispatch(setCountriesList(result.data))
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

    columnHelper.accessor('iso_name', {
      header: 'ISO Name',
      cell: (info) => info.getValue(),
    }),
    // columnHelper.display({
    //   id: 'actions',
    //   cell: ({ row }) => (
    //     <div className="flex justify-end gap-2">
    //       <Link href={{ pathname: `/dashboard/countries/edit/${row.original?._id}`, search: `query=${JSON.stringify(row.original)}` }}>
    //         <Button variant="ghost" size="sm">
    //           <Edit className="h-4 w-4" />
    //         </Button>
    //       </Link>
    //     </div>
    //   ),
    // }),
  ];
  const itemsPerPage = 20;
  const paginatedData = countriesList?.slice(
    (lastId - 1) * itemsPerPage,
    lastId * itemsPerPage
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Countries Management</h1>
        <p className="text-gray-600">View and manage Countries information</p>
      </div>
      <div className='flex justify-end gap-2'>
        <ImportCountryExcel handleCountries={handleGet} />
        {/* <Link className='' href={'/dashboard/countries/add'}> <Button size='md' variant='ghost' ><Plus size={15} className='me-2' /> New Countries </Button> </Link> */}
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={paginatedData} loading={isLoading} setLastId={setLastId} lastId={lastId} count={Math.ceil(countriesList?.length / itemsPerPage)} />
        </div>
      </div>
    </div>
  );
}