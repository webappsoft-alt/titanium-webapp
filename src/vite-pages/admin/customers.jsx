'use client'
import { useCallback, useEffect, useState } from "react";
import {
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CustomerDetailsDialog } from "@/components/admin/customer-details-dialog";
import ApiFunction from "@/lib/api/apiFuntions";
import { handleError } from "@/lib/api/errorHandler";
import toast from "react-hot-toast";
import { DTable } from "@/components/admin/dTable";
import { Cross, Edit, Filter, Plus, X } from "lucide-react";
import { UserFilterForm } from "@/components/admin/filter-dialog";
import moment from "moment";
import ImportCustomerExcel from "@/lib/utils/importCustomerExcel";
import { useDispatch } from "react-redux";
import { setCustomerData } from '@/lib/redux/products';
import Link from "next/link";

const columnHelper = createColumnHelper();

export function AdminCustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { get, put } = ApiFunction();
  const [isLoading, setIsLoading] = useState(true);
  const [isAccpectLoading, setIsAccpectLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [count, setCount] = useState(0);
  const [lastId, setLastId] = useState(1);
  const [filterData, setFilterData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const handleUserList = useCallback(async (pageNo) => {
    setIsLoading(true);
    await get(`users/customer/${pageNo}/all`, { ...filterData, type: 'customer' })
      .then((result) => {
        if (result.success) {
          setUserList(result.users);
        } else {
          setUserList([]);
        }
        setCount(result.count.totalPage);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lastId, filterData]);
  useEffect(() => {
    handleUserList(lastId);
  }, [lastId, filterData]);
  const handleAcceptCustomer = (id, status) => {
    setIsAccpectLoading(true);
    put(`users/change/${status}/${id}`)
      .then((result) => {
        if (result.success) {
          handleUserList();
          toast.success(result.message);
        }
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        setIsAccpectLoading(false);
      });
  };
  const columns = [
    columnHelper.display({
      id: "createdAt", // A unique ID for this column
      header: "CreatedAt",
      cell: (info) => {
        const { createdAt } = info.row.original; // Access the original row data
        return moment(createdAt).format("lll");
      },
    }),
    columnHelper.display({
      id: "email", // A unique ID for this column
      header: "Email",
      cell: (info) => {
        const { email, _id } = info.row.original; // Access the original row data
        return (
          <Link
            className="underline text-blue-700 font-medium"
            href={`/dashboard/customers/edit/${_id}`}
            state={info.row.original}
          >
            {" "}
            {email}
          </Link>
        );
      },
    }),
    columnHelper.display({
      id: "status", // A unique ID for this column
      header: "Approval",
      cell: (info) => {
        const { status } = info.row.original; // Access the original row data
        const isActive = status.toLowerCase() === "active"; // Determine if status is active

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${isActive
              ? "bg-green-100 text-green-800" // Styles for active status
              : "bg-red-100 text-red-800" // Styles for inactive status
              }`}
          >
            {isActive
              ? "Approved"
              : status === "deactivated"
                ? "Deactivated"
                : "Pending Approval"}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "name", // A unique ID for this column
      header: "Name",
      cell: (info) => {
        const { fname, lname } = info.row.original; // Access the original row data
        return `${fname || ""} ${lname || ""}`.trim() || "-"; // Combine and handle missing values
      },
    }),

    columnHelper.accessor("company", {
      header: "Company",
      cell: (info) => info.getValue() || "-",
    }),

    columnHelper.display({
      id: "branch", // A unique ID for this column
      header: "Branch",
      cell: (info) => {
        const { assignBranch } = info.row.original; // Access the original row data
        return assignBranch?.code || ""; // Combine and handle missing values
      },
    }),
    columnHelper.display({
      id: "Stratix", // A unique ID for this column
      header: "Stratix",
      cell: (info) => {
        const { stratixAccount } = info.row.original; // Access the original row data
        return stratixAccount; // Combine and handle missing values
      },
    }),
    columnHelper.display({
      id: "industry", // A unique ID for this column
      header: "Industry",
      cell: (info) => {
        const { industry, otherIndustry } = info.row.original; // Access the original row data
        return industry || otherIndustry || ""; // Combine and handle missing values
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const { status, _id } = row.original;
        return (
          <div className="flex justify-end gap-2 items-center">
            <Link
              className="underline text-blue-700 font-medium"
              href={`/dashboard/customers/edit/${_id}`}
              state={row.original}
            >
              {" "}
              <Edit size={17} />{" "}
            </Link>
            {status === "deactivated" ? (
              <Button
                variant={"primary"}
                size="sm"
                disabled={isAccpectLoading}
                onClick={() =>
                  handleAcceptCustomer(
                    row?.original?._id,
                    status === "active" ? "deactivated" : "active"
                  )
                }
              >
                Activate
              </Button>
            ) : (
              <Button
                variant={status === "active" ? "secondary" : "danger"}
                size="sm"
                className={
                  status !== "active"
                    ? ""
                    : "bg-red-600 text-white hover:bg-red-700"
                }
                disabled={isAccpectLoading}
                onClick={() =>
                  handleAcceptCustomer(
                    row?.original?._id,
                    status === "active" ? "deactivated" : "active"
                  )
                }
              >
                {status === "active" ? (
                  <X size={17} />
                ) : isAccpectLoading ? (
                  "Accpet...."
                ) : (
                  "Accept"
                )}
              </Button>
            )}
          </div>
        );
      },
    }),
  ];
  useEffect(() => {
    dispatch(setCustomerData(null))
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <p className="text-gray-600">View and manage customer information</p>
      </div>
      <div className="flex gap-3 justify-end">
        <Link className="" href={"/dashboard/customers/add"}>
          {" "}
          <Button size="sm">
            <Plus size={15} className="me-2" /> New Customer{" "}
          </Button>{" "}
        </Link>
        {/* <Button size='sm' onClick={() => setIsOpen(true)} variant='outline'> <Filter size={15} className='me-2' /> Filter </Button> */}
      </div>
      <UserFilterForm
        onClose={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        filterData={filterData}
        setFilterData={setFilterData}
      />
      {/* <FileJoinerFromFolder /> */}

      <div className="flex justify-end gap-2">
        <ImportCustomerExcel handleGetUser={() => handleUserList(1)} />
        {/* <ImportAddressExcel /> */}
      </div>
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <DTable
            columns={columns}
            products={userList}
            loading={isLoading}
            setLastId={setLastId}
            lastId={lastId}
            count={count}
          />
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
