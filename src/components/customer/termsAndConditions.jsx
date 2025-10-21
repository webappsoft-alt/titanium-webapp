"use client"
import React, { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import ApiFunction from '@/lib/api/apiFuntions';
import SpinnerOverlay from '../ui/spinnerOverlay';
import { setTerms } from '@/lib/redux/products';

const TermsAndConditions = () => {
  const terms = useSelector(state => state.prod.terms)
  const { put, post, get, deleteData } = ApiFunction()
  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch()
  const getTermConditions = async () => {
    if (terms) {
      return
    }
    setIsloading(true);

    const apiGet = `static-pages/admin/terms-condition`

    await get(apiGet)
      .then((result) => {
        if (result.success) {
          dispatch(setTerms(result.staticPage));
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
    <div className="">
      {isloading && <SpinnerOverlay />}
      <div className="w-full">
        {/* Header Banner */}
        <div className="w-full bg-gray-800 px-5 py-5 text-white relative rounded-xl">
          <h1 className="text-blue-400 text-xl font-semibold mb-0">Terms and Conditions <span className='text-white '>of Sale and Delivery</span> </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-6 px-4">
          <Button >
            Contact Us
          </Button>
          <Button >
            Create Quote
          </Button>
          <Button >
            Weight Calculator
          </Button>
        </div>

        {/* Main Content */}
        <div className="px-6 py-4">
          <h2 className="text-blue-900 text-xl font-semibold mb-4">
            Titanium Industries' Terms and Conditions of Sale and Delivery
          </h2>

          <div dangerouslySetInnerHTML={{ __html: terms?.detail }} className="text-gray-700 mb-3"></div>
          {/* Regions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* North America */}
            <div>
              <h3 className="text-blue-900 font-medium mb-3">North America</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    United States – Sale Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    United States – Purchase Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    United States – Paperwork Revisions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    Canada – English Version
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    Canada – French Version
                  </a>
                </li>
              </ul>

              <h3 className="text-blue-900 font-medium mt-6 mb-3">South America</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    Brazil
                  </a>
                </li>
              </ul>
            </div>

            {/* Europe */}
            <div>
              <h3 className="text-blue-900 font-medium mb-3">Europe</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    United Kingdom
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    Germany
                  </a>
                </li>
              </ul>

              <h3 className="text-blue-900 font-medium mt-6 mb-3">Asia</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    China
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:underline">
                    Taiwan
                  </a>
                </li>
              </ul>
            </div>

            {/* Third column is empty in the design */}
            <div></div>
          </div>

          {/* Social Media */}
          <div className="mt-8">
            <p className="text-blue-400 mb-3">Follow us on Social Media:</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-800 hover:text-blue-500 transition">
                <div className="bg-white p-2 rounded-full border border-gray-800">
                  <FaInstagram size={20} />
                </div>
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-500 transition">
                <div className="bg-white p-2 rounded-full border border-gray-800">
                  <FaLinkedin size={20} />
                </div>
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-500 transition">
                <div className="bg-white p-2 rounded-full border border-gray-800">
                  <FaTwitter size={20} />
                </div>
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-500 transition">
                <div className="bg-white p-2 rounded-full border border-gray-800">
                  <FaFacebook size={20} />
                </div>
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-500 transition">
                <div className="bg-white p-2 rounded-full border border-gray-800">
                  <FaYoutube size={20} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;