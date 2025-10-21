'use client'
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import { handleError } from '@/lib/api/errorHandler';
import toast from 'react-hot-toast';
import { DTable } from '@/components/admin/dTable';
import { Trash2, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

const columnHelper = createColumnHelper();

export function AdminFileDetail() {
  const { get, deleteData } = ApiFunction();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState('');
  const [fileList, setFileList] = useState([]);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);

  const handleGet = async (pageNo = 1) => {
    setIsLoading(true);
    try {
      const result = await get(`file/all/${pageNo}`);
      if (result.success) {
        setFileList(result.files);
        setCount(result.count.totalPage);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGet(lastId);
  }, [lastId]);

  const handleDeleteFile = (id) => {
    setIsDeleteLoading(id);
    deleteData(`file/${id}`)
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          handleGet(lastId);
        }
      })
      .catch(handleError)
      .finally(() => {
        setIsDeleteLoading('');
      });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'File Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('size', {
      header: 'Size',
      cell: (info) => formatFileSize(info.getValue()),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue().toUpperCase(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Uploaded At',
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor('url', {
      header: 'File URL',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          View
        </a>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            disabled={isDeleteLoading === row.original._id}
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteFile(row.original._id)}
          >
            {isDeleteLoading === row.original._id ? <Spinner size="sm" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Uploaded File Management</h1>
        <p className="text-gray-600">View and manage uploaded files</p>
      </div>
 
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable
            columns={columns}
            products={fileList}
            loading={isLoading}
            setLastId={setLastId}
            lastId={lastId}
            count={count}
          />
        </div>
      </div>
    </div>
  );
}
