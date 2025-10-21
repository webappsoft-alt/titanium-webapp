'use client'
import { CustomerDetailsDialog } from '@/components/admin/customer-details-dialog';
import { DTable } from '@/components/admin/dTable';
import { Button } from '@/components/ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import { Edit, Plus } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from 'react';

const columnHelper = createColumnHelper();

export function AdminCategoryCalPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, } = ApiFunction()
  const [isLoading, setIsLoading] = useState(false);
  const [categoryInformation, setcategoryInformation] = useState([]);
  const [lastId, setLastId] = useState(1);

  const handleGet = async () => {
    setIsLoading(true)
    await get(`category/all`)
      .then((result) => {
        if (result) {
          setcategoryInformation(result.categories)
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
    columnHelper.display({
      id: 'category',
      header: 'Category',
      cell: (info) => {
        const { name } = info.row.original;
        return (name)
      },
    }),
    columnHelper.display({
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <img src={row?.original?.images?.length > 0 ? row?.original?.images[0] : ''} height={50} width={50} alt='' />
        </div>
      ),
    }),
    columnHelper.display({
      id: 'description',
      header: 'Description',
      cell: (info) => {
        const { description } = info.row.original;
        return (description)
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Link href={{ pathname: `/dashboard/category-management/edit/${row.original?._id}`, search: `query=${JSON.stringify(row.original)}` }}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="text-gray-600">View and manage Category information</p>
      </div>
      <div className='flex justify-end'>
        <Link className='' href={'/dashboard/category-management/add'}> <Button size='sm' ><Plus size={15} className='me-2' /> New Category </Button> </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable columns={columns} products={categoryInformation} loading={isLoading} setLastId={setLastId} lastId={lastId} />
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