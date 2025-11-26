'use client'
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";
import { MoreHorizontal, ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Select, SelectOption } from "../ui/select";
import ApiFunction from "@/lib/api/apiFuntions";
import SpinnerOverlay from "../ui/spinnerOverlay";
import { Button } from "../ui/button";
import { increasePrice } from "@/lib/api/encrypted";
import { useSelector } from "react-redux";
import { Spinner } from "../ui/spinner";
import { UomOptions } from "../tools/calculator/utils";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 12;

const PaginationEllipsis = () => (
  <span className="flex h-9 w-9 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

const DiscountedTable = ({ tablesData, setTabelsData, totalItems, totalPages, setLastId, isTableLoad }) => {
  const competMarkup = useSelector(state => state.prod.competMarkup)
  const isLogin = useSelector(state => state.auth.isLogin)
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.auth.userData)
  const { get, post } = ApiFunction();
  const { push } = useRouter()
  const [quantityData, setQuantityData] = useState({});
  const priceRanges = [
    { min: 0, max: 1, },
    { min: 1.01, max: 2, },
    { min: 2.01, max: 3, },
    { min: 3.01, max: 4, },
    { min: 4.01, max: 5, },
    { min: 5.01, max: 10, },
    { min: 10.01, max: 20, },
    { min: 20.01, max: 30, },
    { min: 30.01, max: 40, },
    { min: 40.01, max: 50, },
    { min: 50.01, max: 75, },
    { min: 75.01, max: 100, },
    { min: 100.01, max: 125, },
    { min: 125.01, max: 150, },
    { min: 150.01, max: 200, },
    { min: 200.01, max: 300, },
    { min: 300.01, max: 400, },
    { min: 400.01, max: 500, },
    { min: 500.01, max: 600, },
    { min: 600.01, max: 700, },
    { min: 700.01, max: 800, },
    { min: 800.01, max: 900, },
    { min: 900.01, max: 1000, },
    { min: 1000.01, max: 2500, }
  ];

  const getPriceForWeight = (inputWeight) => {
    const parsedWeight = parseFloat(inputWeight);

    if (isNaN(parsedWeight)) {
      return;
    }

    const matchedRange = priceRanges.find(
      range => parsedWeight >= range.min && parsedWeight <= range.max
    );
    return matchedRange
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setLastId(newPage)
    }
  };
  const handleOnChange = (i, totalQuantity) => {
    const quantity = Math.max(1, Number(totalQuantity));
    setQuantityData((prev) => ({ ...prev, [i]: quantity }));
  };

  const handleUomChange = async (i, selectedUom, item) => {
    if (!Number(quantityData[i]) > 0) {
      return
    }
    setIsLoading(true);
    const { min, max } = getPriceForWeight(Number(item?.quantity))
    const uomData = UomOptions?.find((item => item.value === selectedUom))?.label
    let priceLabel = uomData === 'lb' ? `$/${uomData}. Sales Price for ${min}  to ${max} lbs.` : `$/ ${uomData} Sales Price for ${min}  to ${max} lbs.`
    try {
      const result = await get("prices/admin", { id: item?.uniqueID, priceLabel: priceLabel });
      if (result.success) {
        const priceData = { ...result?.prices?.prices, price: increasePrice(result?.prices?.prices?.price, userData?.isCompetitor, competMarkup) }
        setTabelsData((prevData) =>
          prevData.map((row) =>
            row?._id === i ? { ...row, prices: priceData, pricesId: result?.prices?._id, uom: selectedUom } : row
          )
        );
      } else {
        setTabelsData((prevData) =>
          prevData.map((row) =>
            row?._id === i ? { ...row, prices: 0, uom: selectedUom } : row
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnBlurQuantity = async (i, item, quantity) => {
    if (!Number(quantity) > 0) {
      return
    }
    setIsLoading(true);
    const { min, max } = getPriceForWeight(Number(quantity))
    const uomData = UomOptions?.find((itemInner => itemInner.value === item?.uom))?.label
    let priceLabel = uomData === 'lb' ? `$/${uomData}. Sales Price for ${min}  to ${max} lbs.` : `$/ ${uomData} Sales Price for ${min}  to ${max} lbs.`
    try {
      const result = await get("prices/admin", { id: item?.uniqueID, priceLabel: priceLabel });
      if (result.success) {
        if (result?.prices?.prices?.price === 'Call for Price') {
          alert('Your selection exceeds maximum quantities available through our website. Please contact us today: email us at sales@titanium.com or call +1 973.983.1185')
          setTabelsData((prevData) =>
            prevData.map((row) =>
              row?._id === i ? { ...row, prices: 0, quantity } : row
            )
          );
        } else {
          const priceData = { ...result?.prices?.prices, price: increasePrice(result?.prices?.prices?.price, userData?.isCompetitor, competMarkup) }
          setTabelsData((prevData) =>
            prevData.map((row) =>
              row?._id === i ? { ...row, prices: priceData, quantity, pricesId: result?.prices?._id, } : row
            )
          );

        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAdd = async (item) => {
    if (!isLogin) {
       push('/auth/login')
      return
    }
    setIsLoading(true)
    await post('/cart/create', item)
      .then((result) => {
        if (result.success) {
          push('/quick-quote')
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => setIsLoading(false))
  }

  const renderPaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) pages.push(<PaginationEllipsis key="left-ellipsis" />);

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) pages.push(<PaginationEllipsis key="right-ellipsis" />);

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };
  const convertLbToFeet = (value, lbFTwithoutTol) => {
    return Math.round(Number(value) / Number(lbFTwithoutTol))
  }
  return (
    <>
      {isLoading && <SpinnerOverlay />}
      <div className="pb-2 bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg">
        {isTableLoad ? <div className="flex justify-center py-10 px-4"> <Spinner /> </div> : (tablesData.length > 0 && (
          <Table>
            <TableHeader>
              <TableHead>Diameter / Thickness</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Sub Total</TableHead>
            </TableHeader>
            {tablesData?.map((item) => (
              <TableBody key={item?._id}>
                <TableRow>
                  <TableHead colSpan={7} className="text-black">{item?.alloyFamily}, {item?.productForm} - {item?.gradeAlloy || ''}</TableHead>
                </TableRow>
                <TableRow>
                  <TableCell>{item?.primaryDimension || ''}</TableCell>
                  <TableCell>{item?.length ? <span>{`${(item?.length).toFixed(4)}"`}</span> : ""} {item?.lengthTolerance ? <span className="text-xs">{`±${(item?.lengthTolerance)}"`}</span> : ""}</TableCell>
                  <TableCell className="min-w-48">{item?.specifications} </TableCell>
                  <TableCell className="">
                    {item?.available_quantity} lb <br />
                    {convertLbToFeet(item?.available_quantity, item?.lbFTwithoutTol)} ft <br />
                    {convertLbToFeet(item?.available_quantity, item?.lbFTwithoutTol) * 12} inch
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 min-w-48">
                      <Input
                        type="number"
                        min="0"
                        onChange={(e) => handleOnChange(item?._id, e.target.value)}
                        onBlur={(e) => handleOnBlurQuantity(item?._id, item, e.target.value)}
                        value={quantityData?.[item?._id] || ""}
                      />
                      <Select value={item?.uom} onChange={(e) => handleUomChange(item?._id, e.target.value, item)}>
                        <SelectOption disabled value="">Select...</SelectOption>
                        {UomOptions?.map((item, index) => (<SelectOption key={index} value={item.value}>{item.label}</SelectOption>))}
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>{item?.prices !== 0 ? `$${Number(item?.prices?.price || 0).toFixed(2)}` : '__'}</TableCell>
                  <TableCell> {item?.prices !== 0 ? `$${(Number(item?.prices?.price || 0) * Number(item?.quantity || 0)).toFixed(2)}` : '__'} </TableCell>
                  <TableCell>
                    {item?.prices !== 0 ?
                      <Button onClick={() => handleAdd(item)} disabled={Number(item?.prices?.price || 0) === 0} className="text-sm whitespace-nowrap flex gap-2 items-center"><ShoppingCart size={14} /> Add to Quote </Button> :
                      <p className="text-base mb-0">
                        Updating stock
                        Please call for price
                        (888) 482-6486
                      </p>}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        ))}

        {/* Pagination Controls */}
        <div className="flex items-center flex-col justify-center gap-3 mt-4">
          <span className="text-sm text-gray-600">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}
          </span>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default DiscountedTable;
