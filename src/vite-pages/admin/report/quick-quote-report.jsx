'use client'
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ApiFunction from "@/lib/api/apiFuntions";
import exportToExcel from "@/lib/utils/exportCustomerExcel";
import moment from "moment";
import React, { useCallback, useState } from "react";

const QuickQuoteReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { get } = ApiFunction()
  const handleGenerateReport = useCallback(async (pageNo = 1) => {
    setIsLoading(true);
    await get(`quotation/generate-report`)
      .then((result) => {
        if (result.success) {
          const quoteData = result.quotations;
          const data = quoteData.map((quote) => ({
            ID: quote?._id,
            created_at: moment(quote?.createdAt).format("l"),
            updated_at: moment(quote?.updatedAt).format("l"),
            number: quote?.type == 'cart' ? quote?.orderNo : quote?.quoteNo,
            status: quote?.status === "closed" ? "archived" : quote?.status,
            closed_reason: quote?.closedReason || '',

            company: quote?.company,
            stratix_account: quote?.user?.stratixAccount,
            user_id: quote?.user?._id,
            customerStatus: quote?.user?.customerStatus || '',
            email: quote?.email,
            full_name: `${quote?.fname} ${quote?.lname || ""}`,
            phone: quote?.phone,
            account_manager: quote?.user?.accountManager?.email || "",
            regional_manager: quote?.user?.regionalManager?.email || "",
            salesRep: quote?.user?.salesRep?.email || "",
            branch: quote?.user?.assignBranch?.code || "",

            item_total: quote?.totalAmount,
            total: quote?.totalAmount,
            adjustment_total: 0,
            bill_address_id: quote?.address1,
            ship_address_id: quote?.address1,
            payment_total: 0,
            shipment_state: "",
            payment_state: "",
            special_instructions: quote?.notes,
          }));
          exportToExcel({ data: data, name: "quick_quote_activity" });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Quick Quote Activity</h1>
          <p className="text-gray-600">
            View and manage quick quote activity report
          </p>
        </div>
        <Button
          type="submit"
          onClick={handleGenerateReport}
          className="px-5 max-[500px]:text-xs whitespace-nowrap"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size="sm" className="mx-auto" />
          ) : (
            "Generate Quick Quote Activity Report"
          )}
        </Button>
      </div>
    </>
  );
};

export default QuickQuoteReport;
