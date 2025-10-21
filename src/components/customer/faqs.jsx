'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import ApiFunction from '@/lib/api/apiFuntions';
import SpinnerOverlay from '../ui/spinnerOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { setFaqs } from '@/lib/redux/products';
import Link from 'next/link';

const TitaniumFAQPage = () => {
  const {  get, } = ApiFunction()
  const [isloading, setIsloading] = useState(false);
  const faqs = useSelector(state => state.prod.faqs)
  const dispatch = useDispatch()
  const faqItems = [
    {
      question: "Can I request a quote on titanium.com?",
      answer: "Yes! Please click on the \"Create Quote\" link on the Quote Creation portion of our website."
    },
    {
      question: "What happens to the quotation created by my quote?",
      answer: "Your quote/RFQ number in the \"Quote Quote Application\" form that is auto-populated in \"Your Quote\" (located in the upper right corner of your titanium.com)."
    },
    {
      question: "Can I continue to build my quote/order on the new Quote Application?",
      answer: "Yes! Please select your product from the drop downs and click \"Add to Quote\" and your selection will be displayed below."
    },
    {
      question: "Can I add substitutions to my quote?",
      answer: "Yes, a sales associate will reach out to you for specific substitutions."
    },
    {
      question: "Are products offered on TI websites for export-only, foreign producers may not have entry to US?",
      answer: "Products listed on our site are available for domestic shipment."
    },
    {
      question: "Are prices and availability subject to change?",
      answer: `Prices listed on Titanium Industries' website (titanium.com) provided by way of a "Quotation" or "Pricing List" are subject to change upon order receipt by a Titanium Industries representative. In addition, availability of products listed may vary and is subject to change based on market conditions and other factors including, but not limited to, changes in raw material prices, which will be notified and afforded an opportunity to cancel the order.`
    },
    {
      question: "How can I produce an export license for products?",
      answer: "During products offered on TI's websites(s) (titanium.com), please reach out to us at 1-888-482-6486 or send an email to info@titanium.com with your questions."
    },
    {
      question: "How do I request certifications or other documents?",
      answer: "Certifications and supporting documents are available upon request."
    },
    {
      question: "How do I access previous orders I placed on the online store?",
      answer: "Once you login, the orders in your account. Please click \"My Account\" located at the top right corner of your browser screen."
    },
    {
      question: "How do I view previous orders in my current account I have with TI?",
      answer: "Your orders are connected to your account. Click on \"My Account\" located at the top right of your browser screen through the link to log in to \"My Account\" located above."
    },
    {
      question: "How do I select shipping methods through the Quote Application?",
      answer: "The shipping screen will provide shipping methods."
    },
    {
      question: "When do I pay using the Quote Application?",
      answer: "Payment options are available on the final checkout screens. Credit Cards and Pay by Invoice are currently options that exceed."
    }
  ];
  const images = [
    'https://titanium.com/wp-content/uploads/2019/09/200x200_0000_PrattWhiteneyLCS_0001_Background.png',
    'https://titanium.com/wp-content/uploads/2019/09/200x200_0001_image005.png',
    'https://titanium.com/wp-content/uploads/2024/03/ISO_2024.png',
    'https://titanium.com/wp-content/uploads/2024/03/AS9100_ASR_250x159-159-x-300-px-1.png',
    'https://titanium.com/wp-content/uploads/2019/10/NACE-logo-300x180.png',
    'https://titanium.com/wp-content/uploads/2024/03/UKGERMANY-NJ-US-LOCATION2-1.png'
  ]
  const getTermConditions = async () => {
    if (faqs?.length > 0) {
      return
    }
    setIsloading(true);

    const apiGet = `static-pages/admin/faqs`

    await get(apiGet)
      .then((result) => {
        if (result.success) {
          dispatch(setFaqs(result.staticPage));
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  useEffect(() => {
    getTermConditions()
  }, []);
  return (
    <>
      {isloading && <SpinnerOverlay />}
      <div className="">

        {/* Header Banner */}
        <div className="w-full bg-gray-800 px-5 py-5 text-white relative rounded-xl">
          <h1 className="text-blue-400 text-xl font-semibold mb-0"> <span className='text-white '>Titanium Industries | </span> Frequently Asked Questions</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-6 px-4">
          <Link href={'/contact'}>
            <Button >
              Contact Us
            </Button>
          </Link>
          <Link href={'/customer/quick-quote'}>
            <Button >
              Create Quote
            </Button>
          </Link>
          <Link href={'/tools/calculator'}>
            <Button >
              Weight Calculator
            </Button>
          </Link>
        </div>
        <div className=" px-4 py-8">
          <div className="space-y-6">
            {faqs?.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <p className="font-medium text-gray-800 mb-2">{index + 1}. {item?.faqs?.question}</p>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: item?.faqs?.answer }}></div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <p>For further information please contact us at 1-888-482-6486 or worldwide:</p>
            <p className="mt-2">Birmingham, UK and Weeabaden, Germany representative numbers are 441384-401320 & 496121-4500001 respectively</p>
          </div>

          {/* Approvals Section */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-blue-900 mb-6 text-center">TI APPROVALS</h3>

            <div className="flex flex-wrap gap-4 justify-items-center">
              {/* Placeholder for certification logos */}
              {images.map((item, index) => (
                <img src={item} alt='' key={index} className='object-contain' />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-gray-500">
            <p>For a complete range of approvals from major OEM's and industry organizations, Medical, Industrial, and Oil and Gas markets.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitaniumFAQPage;