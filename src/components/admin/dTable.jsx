'use client'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'; // <-- use the improved pagination component

export function DTable({ products = [], loading, columns, count, lastId, setLastId }) {
  const table = useReactTable({
    data: products,
    columns,
    pageCount: count,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: lastId - 1,
      },
    },
  });

  // Handle page change
  const handlePageChange = (pageIndex) => {
    setLastId(pageIndex + 1); // keep in sync with your 1-based page
    table.setPageIndex(pageIndex);
  };

  if (products?.length === 0) {
    return loading ? (
      <div className="flex justify-center items-center py-8">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    ) : (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No Data found</p>
      </div>
    );
  }

  // Generate page numbers with ellipsis (basic logic: always show first, last, current ±2)
  const pageIndex = table.getState().pagination.pageIndex;
  const pages = [];
  const totalPages = count;

  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= pageIndex - 1 && i <= pageIndex + 1)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== 'ellipsis' // prevent duplicate ellipsis
    ) {
      pages.push('ellipsis');
    }
  }

  return (
    <div className="rounded-lg border bg-white">
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* New Numbered Pagination */}
      <div className="flex justify-center p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {pages.map((p, i) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    size="sm"
                    isActive={p === pageIndex}
                    onClick={() => handlePageChange(p)}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
