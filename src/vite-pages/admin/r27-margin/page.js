/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { DTable } from "@/components/admin/dTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApiFunction from "@/lib/api/apiFuntions";
import { setCountriesList } from "@/lib/redux/products";
import ImportR27Margin from "@/lib/utils/importR27Margin";
import { createColumnHelper } from "@tanstack/react-table";
import { View } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const columnHelper = createColumnHelper();

export function AdminR27MarginPage() {
  const { get, put, deleteData } = ApiFunction();
  const [isLoading, setIsLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const countriesList = useSelector((state) => state.prod.countriesList) || [];
  const dispatch = useDispatch();

  const [displayModal, setDisplayModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleGet = async (pageNo = 1) => {
    setIsLoading(true);
    await get(`r27-margin`)
      .then((result) => {
        if (result?.success) {
          dispatch(setCountriesList(result?.data));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    handleGet();
  }, []);
  
  const handleDisplayModal = (row) => {
    setSelectedRow(row)
    setDisplayModal(true);
  };

  const columns = [
    columnHelper.accessor("range", {
      header: "Range",
      cell: (info) => (
        <h1>{info.getValue()?.start}{info.getValue()?.infinity ? "+" : "-" + info.getValue()?.end}</h1>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2 cursor-pointer">
          <View className="h-4 w-4"onClick={() => handleDisplayModal(row?.original)} />
        </div>
      ),
    }),
  ];
  const itemsPerPage = 20;
  const paginatedData = countriesList?.slice(
    (lastId - 1) * itemsPerPage,
    lastId * itemsPerPage
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">R27 Margin Management</h1>
        <p className="text-gray-600">View and manage R27 Data</p>
      </div>
      <div className="flex justify-end gap-2">
        <ImportR27Margin handleR27Margin={handleGet} />
        {/* <Link className='' href={'/dashboard/countries/add'}> <Button size='md' variant='ghost' ><Plus size={15} className='me-2' /> New Countries </Button> </Link> */}
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable
            columns={columns}
            products={paginatedData}
            loading={isLoading}
            setLastId={setLastId}
            lastId={lastId}
            count={Math.ceil(countriesList?.length / itemsPerPage)}
          />
        </div>
      </div>

      <Dialog open={displayModal} onClose={() => setDisplayModal(false)}>
        <DialogContent
          className="w-full h-[90vh] max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl"
          closeButton={true}
          onClose={() => setDisplayModal(false)}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
              Range: {selectedRow?.range?.start}{selectedRow?.range?.infinity ? "+" : "-" + selectedRow?.range?.end}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[80vh] overflow-y-auto">
            <div className="">
              {selectedRow?.marginCode?.map((item) => (
                  <div key={item?._id} className="flex justify-between mb-2 border-b pb-2 px-2 shadow-sm">
                    <h1>{item?.label}</h1>
                    <h1>{Math.round(item?.value * 100) + "%"}</h1>
                  </div>
                )
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
