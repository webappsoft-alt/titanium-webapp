'use client'
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>

            <div className="prose prose-blue max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Titanium Industries, Inc. ("T.I.") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and handle your personal information when you use our website, products, and services.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <p>
                We collect information to provide better services to our customers and improve your experience. We collect information in the following ways:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Information you provide to us directly</li>
                <li>Information we get from your use of our website and services</li>
                <li>Information from third-party sources</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Process your orders and transactions</li>
                <li>Provide customer service and support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}