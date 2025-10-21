'use client'
import { useEffect, useState } from 'react';
import { FileSpreadsheet, Upload, Boxes, List, Edit, Trash2, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExcelProcessor from '@/lib/utils/excelProcessor';
import ApiFunction from '@/lib/api/apiFuntions';
import { Spinner } from '@/components/ui/spinner';
import debounce from 'debounce';
import { createColumnHelper } from '@tanstack/react-table';
import { DTable } from '@/components/admin/dTable';
import ImportProductData from '@/lib/utils/importProductData';
import toast from 'react-hot-toast';
import { DeleteDialog } from '@/components/admin/delete-dialog';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
const columnHelper = createColumnHelper();

const columns = [

  columnHelper.accessor('alloyFamily', {
    header: 'Alloy Family',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  // columnHelper.display({
  //   id: 'actions',
  //   cell: ({ row }) => (
  //     <div className="flex justify-end gap-2">
  //       <Button variant="ghost" size="sm">
  //         <Edit className="h-4 w-4" />
  //       </Button>
  //       <Button variant="ghost" size="sm">
  //         <Trash2 className="h-4 w-4" />
  //       </Button>
  //     </div>
  //   ),
  // }),
];

export function AdminProductsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { get, deleteData } = ApiFunction()
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);

  const [countProd, setCountProd] = useState(0);
  const [lastIdProd, setLastIdProd] = useState(1);

  const [isLoading, setIsLoading] = useState(true)
  const [isDelLoading, setIsDelLoading] = useState(false)
  const [productsData, setProductsData] = useState([]);
  const [productsEnterData, setProductsEnterData] = useState([]);
  const [delData, setDelData] = useState(null);

  const handleGetProduct = debounce(async (pageNo = 1) => {
    setIsLoading(true)
    await get(`product/admin/${pageNo}`)
      .then((result) => {
        if (result.success) {
          setProductsData(result.products)
        }
        setCount(result.count.totalPage)
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }, 300)
  const handleGetProductData = debounce(async (pageNo = 1) => {
    setIsLoading(true)
    await get(`prod-data/all/${pageNo}`)
      .then((result) => {
        if (result.success) {
          setProductsEnterData(result.products)
        }
        setCountProd(result.count.totalPage)
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }, 300)
  const HandleDell = async (_id) => {
    setIsDelLoading(true);
    await deleteData(`prod-data/${_id}`)
      .then((result) => {
        toast.success(result?.message);
        handleGetProductData()
        setDelData(null)
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setIsDelLoading(false);
      });
  };
  const columnsProdData = [

    columnHelper.display({
      id: 'Image',
      header: 'Image',
      cell: ({ row }) => (<img src={row?.original?.image} alt='' className='h-8 w-8 object-contain' />),
    }),
    columnHelper.accessor('alloyType', {
      header: 'Product Form',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('alloyFamily', {
      header: 'Alloy Family',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'Featured Product',
      header: 'Featured Product',
      cell: ({ row }) => (row?.original?.isFeature ? 'True' : ''),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Link href={`/dashboard/products/edit/${row?.original?._id}`}>
            <Button variant="ghost" size="sm" >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" d
            disabled={isDelLoading}
            style={{ whiteSpace: "nowrap" }}
            onClick={() => setDelData(row?.original)}>
            {isDelLoading ? (
              <Spinner size="sm" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    }),
  ];
  useEffect(() => {
    handleGetProductData(lastIdProd)
  }, [lastIdProd]);
  useEffect(() => {
    handleGetProduct(lastId)
  }, [lastId]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Product Management</h1>
          <p className="mt-2 text-gray-600">
            Import and manage your product catalog
          </p>
        </div>
        <div className='flex flex-col gap-3'>
          <ExcelProcessor handleGetProduct={() => handleGetProduct()} />
          <ImportProductData handleGetProduct={() => handleGetProductData()} />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="md:hidden mb-4">
          <select
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedTab}
            onChange={(e) => setSelectedTab(Number(e.target.value))}
          >
            <option value={0}>Product List</option>
            <option value={1}>Import Products</option>
          </select>
        </div>

        <TabsList className="hidden md:flex rounded-lg bg-white p-1 shadow-sm">
          <TabsTrigger
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            <List className="h-4 w-4" />
            Product List
          </TabsTrigger>

          <TabsTrigger
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            <Box className="h-4 w-4" />
            Product Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value={0} className="mt-4">
          <div className="overflow-x-auto">
            <DTable
              columns={columns}
              products={productsData}
              loading={isLoading}
              count={count}
              lastId={lastId}
              setLastId={setLastId}
            />
          </div>
        </TabsContent>

        <TabsContent value={1} className="mt-4">
          <div className="overflow-x-auto">
            <DTable
              columns={columnsProdData}
              products={productsEnterData}
              loading={isLoading}
              count={countProd}
              setLastId={setLastIdProd}
              lastId={lastIdProd}
            />
          </div>
        </TabsContent>
      </Tabs>
      <DeleteDialog open={!!delData} isDelLoading={isDelLoading} handleDelete={() => HandleDell(delData?._id)} name={delData?.alloyFamily} onClose={() => setDelData(null)} />

    </div>
  );
}