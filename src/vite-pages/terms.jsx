import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Terms and Conditions of Sale and Delivery
            </h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">
                    Official Terms and Conditions Document
                  </h2>
                  <p className="text-blue-800 mb-4">
                    Please download and review our complete Terms and Conditions of Sale and Delivery document.
                  </p>
                  <a 
                    href="https://titanium.com/wp-content/uploads/2015/02/Terms-and-Conditions-of-Sale-and-Delivery.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-4">
                For the most current and complete terms and conditions, please refer to the PDF document above. 
                These terms and conditions govern all sales and deliveries of products by Titanium Industries, Inc.
              </p>
              <p>
                If you have any questions about our terms and conditions, please contact our customer service team:
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="tel:1-888-482-6486" className="text-blue-600 hover:underline">
                    1-888-482-6486
                  </a>
                </li>
                <li>
                  <a href="mailto:sales@titanium.com" className="text-blue-600 hover:underline">
                    sales@titanium.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}