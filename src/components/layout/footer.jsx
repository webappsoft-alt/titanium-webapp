import { CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Titanium Industries, Inc. (T.I.)</h3>
            <a 
              href="https://titanium.com/titanium-industries-global-metal-supplier-locations/"
              className="text-blue-400 hover:text-blue-300 block"
            >
              View T.I. Global Locations
            </a>
            <a 
              href="https://titanium.com/customer-satisfaction-survey/"
              className="text-blue-400 hover:text-blue-300 block"
            >
              T.I. Approvals and Quality Systems
            </a>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <a 
              href="/terms"
              className="text-gray-400 hover:text-gray-300 block"
            >
              Terms & Conditions
            </a>
            <a 
              href="/privacy"
              className="text-gray-400 hover:text-gray-300 block"
            >
              Privacy Policy
            </a>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">We Accept</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <img
                src="https://www.svgrepo.com/show/328127/visa.svg"
                alt="Visa"
                className="h-8 bg-white rounded px-2 py-1"
              />
              <img
                src="https://www.svgrepo.com/show/328121/mastercard.svg"
                alt="Mastercard"
                className="h-8"
              />
              <img
                src="https://www.svgrepo.com/show/328129/amex.svg"
                alt="American Express"
                className="h-8 bg-white rounded px-2 py-1"
              />
              <img
                src="https://www.svgrepo.com/show/328132/discover.svg"
                alt="Discover"
                className="h-8"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="text-gray-400">
              {/* <p>18 Green Street, Suite 201</p>
              <p>Woodbridge, NJ 07095</p> */}
              <p className="mt-2">
                <a href="tel:1-888-482-6486" className="text-blue-400 hover:text-blue-300">
                  1-888-482-6486
                </a>
              </p>
              <p>
                <a href="mailto:sales@titanium.com" className="text-blue-400 hover:text-blue-300">
                  sales@titanium.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© Copyright 2021 Titanium Industries, Inc. All Rights Reserved -</p>
        </div>
      </div>
    </footer>
  );
}