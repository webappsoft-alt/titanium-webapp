'use client'
import React, { useEffect, useState } from "react";
import QuotationTable from "./quote-table";
import ApiFunction from "@/lib/api/apiFuntions";

const FavoriteProduct = () => {
  const [tabelsData, setTabelsData] = useState([]);
  const { get } = ApiFunction();
  const [isLoadingTransform, setIsLoadingTransform] = useState(false);
  const [favoriteData, setFavoriteData] = useState([]);

  const handleGetFavoriteProducts = async () => {
    setIsLoadingTransform(true)
    await get('favorite')
      .then((result) => {
        setTabelsData(result?.data)
        setFavoriteData(result?.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoadingTransform(false)
      })
  }
  useEffect(() => {
    handleGetFavoriteProducts()
  }, []);
  return (
    <>
      <div className=" ">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Favorite Products</h2>
        {!isLoadingTransform && (
          <div className="">
            <QuotationTable tablesData={tabelsData} setTabelsData={setTabelsData} setFavoriteData={setFavoriteData} favoriteData={favoriteData} isFavoritePage={true} />
          </div>
        )}
      </div>
    </>
  );
};

export default FavoriteProduct;
