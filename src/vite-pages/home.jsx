'use client'
import { HeroSection } from '@/components/home/hero-section';
import { QuickQuoteSection } from '@/components/home/quick-quote-section';
import { ProductCategories } from '@/components/home/product-categories';
import { FeaturedProducts } from '@/components/home/featured-products';
import { ToolsSection } from '@/components/home/tools-section';
import { ContactSection } from '@/components/home/contact-section';
import { CertificationsSection } from '@/components/home/certifications';
import ApiFunction from '@/lib/api/apiFuntions';
import { useDispatch, useSelector } from 'react-redux';
import { setMetalType } from '@/lib/redux/products';
import { useEffect } from 'react';
import { HomeSection } from '@/components/home/homeSection';


export function HomePage() {
  const { get } = ApiFunction()
  const dispatch = useDispatch()
  const metalType = useSelector(state => state.prod.metalType)
  const handleGetAlloyFamily = async () => {
    if (metalType?.length > 0) {
      return
    }
    await get('product/alloy-family')
      .then((result) => {
        if (result.success) {
          dispatch(setMetalType(result.alloyFamilies))
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => { })
  }

  useEffect(() => {
    handleGetAlloyFamily()
  }, []);

  return (
    <div className="relative">
      <HeroSection />
      <QuickQuoteSection />
      <HomeSection />
      <ProductCategories />
      <FeaturedProducts />
      <CertificationsSection />
      <ToolsSection />
      <ContactSection />
    </div>
  );
}