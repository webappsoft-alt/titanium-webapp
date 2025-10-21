'use client'
// src/components/MillProducts.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {  ArrowRight, } from "lucide-react"; // Icons for navigation
import { ProductGrid } from '@/components/products/product-grid';
import Link from "next/link";

const MillProducts = () => {
  const menuData = useSelector((state) => state.menu.items);
  const productData = menuData?.find((item) => item?.label === "MILL PRODUCTS") || { children: [] };
  const productPipeFittingData = menuData?.find((item) => item?.label === "PIPE AND FITTINGS") || { children: [] };
  const pipeFittingData = productPipeFittingData?.children?.length > 0 ? productPipeFittingData?.children?.flatMap(item => item?.children) : []
  // Default to first material
  const [selectedMaterial, setSelectedMaterial] = useState(productData.children[0]?.label || "");

  useEffect(() => {
    if (productData.children.length > 0) {
      setSelectedMaterial(productData.children[0]?.label);
    }
  }, [productData]);

  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-center text-gray-700 mb-0">
        Metal Mill Products
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Select your Metal Material and Product Form
      </p>

      {/* Material Tabs with Swiper */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          navigation={true}
          slidesPerView="auto"
          className="mySwiper"
        >
          {productData?.children?.map((material, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <button
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap min-w-max transition-colors duration-200 ${selectedMaterial === material?.label
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-600"
                  }`}
                onClick={() => setSelectedMaterial(material?.label)}
              >
                {material?.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Product forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {productData?.children
          ?.find((item) => item?.label === selectedMaterial)
          ?.children?.map((product) => (
            <Link
              key={product.name}
              href={product?.slug ? `/product/${product.slug}` : product?.path || ''}
              className="border rounded-lg p-4 flex items-center transition-all hover:shadow-md"
            >
              <div className="flex-shrink-0 mr-3">
                <img src={product?.imgAlt || product?.image} alt="" className="w-8 h-8 object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-gray-800">
                  {product?.label}
                </h3>
              </div>
              <Link
                href={product?.slug ? `/product/${product.slug}` : product?.path || ''}
                className="flex-shrink-0 ml-2"
              >
                <span className="text-gray-500"><ArrowRight size={15} /> </span>
              </Link>
            </Link>
          ))}
      </div>
      <h1 className="text-2xl font-semibold text-center text-gray-700 mb-0 mt-8">
        Pipe and Fittings Products
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Select your Metal Material and Product Form
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-4">
          <ProductGrid products={pipeFittingData || []}  isSimple={true}/>
        </div>
      </div>
    </div>
  );
};

export default MillProducts;
